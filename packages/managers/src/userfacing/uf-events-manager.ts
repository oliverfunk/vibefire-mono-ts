import { DateTime } from "luxon";
import { type PartialDeep } from "type-fest";

import {
  newVibefireEventModel,
  type Pageable,
  type TModelEventType,
  type TModelEventUpdate,
  type TModelVibefireEvent,
} from "@vibefire/models";
import { type RepositoryService } from "@vibefire/services/fauna";
import { trimAndCropText, type AsyncResult } from "@vibefire/utils";

import { ManagerRuleViolation } from "!managers/errors";
import { ReposManager } from "!managers/repos-manager";
import { managerReturn, nullablePromiseToRes } from "!managers/utils";

export class UFEventsManger {
  constructor(private readonly repos: ReposManager) {}

  static fromService(repoService: RepositoryService) {
    return new UFEventsManger(ReposManager.fromService(repoService));
  }

  newEvent(p: {
    userAid: string;
    forGroupId?: string;
    title: string;
    type: TModelEventType["type"];
    private: boolean;
  }) {
    return managerReturn(async () => {
      // non-group event
      if (p.forGroupId === undefined && !p.private) {
        throw new ManagerRuleViolation(
          "You cannot create public events as an individual",
        );
      }

      const group = p.forGroupId
        ? (await this.repos.getGroup(p.forGroupId)).unwrap()
        : null;

      if (group) {
        if (group.group.type === "private" && !p.private) {
          throw new ManagerRuleViolation(
            "This group is private and cannot make public events",
          );
        }

        this.repos
          .checkUserGroupManager(
            group,
            p.userAid,
            "you cannot make events for it",
          )
          .unwrap();
      }

      (
        await this.repos.checkHasReachedDraftLimit(p.userAid, p.forGroupId)
      ).unwrap();

      const title = trimAndCropText(p.title, 100);
      const userProfile = (await this.repos.getUserProfile(p.userAid)).unwrap();
      const ownerName = group?.name ?? userProfile.name;
      const epochCreated = DateTime.utc().toMillis();

      const newEvent = newVibefireEventModel({
        type: p.type,
        public: !p.private,
        ownerId: p.forGroupId ?? p.userAid,
        ownerName,
        ownerType: p.forGroupId ? "group" : "user",
        title,
        epochCreated,
        epochLastUpdated: epochCreated,
      });
      const { id: eventId } = await this.repos.events.create(newEvent).result;

      return eventId;
    });
  }

  async newEventFromPrevious(p: {
    userAid: string;
    forGroupId?: string;
    previousEventId: string;
  }) {
    return managerReturn(async () => {
      const viewEventRes = await this.viewEvent({
        userAid: p.userAid,
        eventId: p.previousEventId,
        scope: "manage",
      });
      const event = viewEventRes.unwrap();

      (
        await this.repos.checkHasReachedDraftLimit(p.userAid, p.forGroupId)
      ).unwrap();

      // be pretty unlikely this happens
      if (p.forGroupId && event.ownerId !== p.forGroupId) {
        throw new ManagerRuleViolation("This event is not part of this group");
      }

      const epochCreated = DateTime.utc().toMillis();

      const newEvent = newVibefireEventModel({
        type: event.event.type,
        public: event.event.public,
        ownerId: event.ownerId,
        ownerName: event.ownerName,
        ownerType: event.ownerType,
        title: event.title,
        epochCreated,
        epochLastUpdated: epochCreated,
      });
      const { id: newEventId } =
        await this.repos.events.create(newEvent).result;

      const eNew = (await this.repos.getEvent(newEventId)).unwrap();

      // copy over the rest of the event
      eNew.times = event.times;
      eNew.location = event.location;
      eNew.images = event.images;
      eNew.event = event.event;

      // update the new event
      const updateEventRes = await this.updateEvent({
        userAid: p.userAid,
        eventId: newEventId,
        update: eNew,
      });
      updateEventRes.unwrap();

      return eNew;
    });
  }

  async eventsByUser(p: {
    userAid: string;
  }): AsyncResult<Pageable<PartialDeep<TModelVibefireEvent>>> {
    return managerReturn<Pageable<TModelVibefireEvent>>(async () => {
      const { data, after: afterKey } = await this.repos.events.byOwner(
        p.userAid,
        10,
      ).result;
      return {
        data,
        afterKey,
        limit: 10,
      };
    });
  }

  async eventsByGroup(p: {
    userAid: string;
    groupId: string;
    scope: "all";
  }): AsyncResult<Pageable<PartialDeep<TModelVibefireEvent>>>;
  async eventsByGroup(p: {
    userAid?: string;
    groupId: string;
    scope: "published";
  }): AsyncResult<Pageable<TModelVibefireEvent>>;
  async eventsByGroup(p: {
    userAid?: string;
    groupId: string;
    scope: "all" | "published";
  }) {
    return managerReturn<Pageable<PartialDeep<TModelVibefireEvent>>>(
      async () => {
        if (p.scope === "all" && !p.userAid) {
          throw new ManagerRuleViolation("You must be signed to view this");
        }

        const g = (await this.repos.getGroup(p.groupId)).unwrap();

        if (p.scope === "all") {
          this.repos
            .checkUserGroupManager(
              g,
              p.userAid!,
              "you cannot view all its events",
            )
            .unwrap();
        }

        const limit = 10;
        const { data, after: afterKey } =
          p.scope === "all"
            ? await this.repos.events.byOwner(p.groupId, limit).result
            : await this.repos.events.byOwnerByState(
                p.groupId,
                1, // published
                limit,
              ).result;

        return {
          data,
          afterKey,
          limit,
        };
      },
    );
  }

  // todo: model incomeplete events and fix the api
  // then the updates, which now will be easy then ur close!

  async viewEvent(p: {
    userAid?: string;
    eventId: string;
    scope: "manage" | "published";
  }) {
    return managerReturn(async () => {
      if (p.scope === "manage" && !p.userAid) {
        throw new ManagerRuleViolation("You must be signed in to view this");
      }

      const e = (await this.repos.getEvent(p.eventId)).unwrap();

      if (p.scope == "manage") {
        (await this.repos.checkUserCanManageEvent(e, p.userAid!)).unwrap();
      } else if (p.scope == "published") {
        this.repos.checkUserCanViewEvent(e, p.userAid).unwrap();
      } else {
        throw new ManagerRuleViolation("Invalid scope");
      }

      return e;
    });
  }

  async viewEventFromLink(p: { userAid?: string; linkId: string }) {
    return managerReturn(async () => {
      const e = (
        await nullablePromiseToRes(
          this.repos.events.withLinkId(p.linkId).result,
          "This link has expired or does not exist",
        )
      ).unwrap();

      if (e.state !== 1) {
        throw new ManagerRuleViolation("This event is not published");
      }

      // if the event is private, add the user to the canView list,
      // if they are signed in
      if (!e.event.public) {
        if (!p.userAid) {
          throw new ManagerRuleViolation("You must sign in to view this event");
        }

        const canView = e.event.canView;
        if (!canView.includes(p.userAid)) {
          canView.push(p.userAid);
          await this.repos.events.update(e.id, { event: { canView } }).result;
        }
      }

      return e;
    });
  }

  async updateEvent(p: {
    userAid: string;
    eventId: string;
    update: Partial<TModelEventUpdate>;
  }) {
    return managerReturn(async () => {
      const e = (await this.repos.getEvent(p.eventId)).unwrap();

      (await this.repos.checkUserCanManageEvent(e, p.userAid)).unwrap();

      // we blindly trust the update here, as we assume
      // all inputs have been validated and sanitized
      await this.repos.events.update(p.eventId, p.update).result;
    });
  }

  async updateEventVisibility(p: {
    userAid: string;
    eventId: string;
    update: "hidden" | "published";
  }) {
    return managerReturn(async () => {
      const e = (await this.repos.getEvent(p.eventId)).unwrap();

      (await this.repos.checkUserCanManageEvent(e, p.userAid)).unwrap();

      const update: Partial<TModelVibefireEvent> = {
        state: p.update === "published" ? 1 : 0,
      };

      await this.repos.events.update(p.eventId, update).result;
    });
  }

  async updateEventLinkId(p: {
    userAid: string;
    eventId: string;
    update: "remove" | "regenerate";
  }) {
    return managerReturn(async () => {
      const e = (await this.repos.getEvent(p.eventId)).unwrap();

      (await this.repos.checkUserCanManageEvent(e, p.userAid)).unwrap();

      const update: Partial<TModelVibefireEvent> = {
        linkId: p.update === "remove" ? null : crypto.randomUUID(),
      };

      await this.repos.events.update(p.eventId, update).result;
    });
  }

  async deleteEvent(p: { userAid: string; eventId: string }) {
    return managerReturn(async () => {
      const e = (await this.repos.getEvent(p.eventId)).unwrap();

      (await this.repos.checkUserCanManageEvent(e, p.userAid)).unwrap();

      const update: Partial<TModelVibefireEvent> = {
        state: 3, // deleted
      };

      await this.repos.events.update(p.eventId, update).result;
    });
  }

  async pageEvents(p: { pageHash: string }) {
    return managerReturn<Pageable<TModelVibefireEvent>>(async () => {
      const { data, after: afterKey } = await this.repos.events.page(p.pageHash)
        .result;
      return {
        data,
        beforeKey: p.pageHash,
        afterKey,
        limit: 10,
      };
    });
  }
}
