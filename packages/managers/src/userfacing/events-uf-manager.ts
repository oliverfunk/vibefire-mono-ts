import { DateTime } from "luxon";
import { type PartialDeep } from "type-fest";

import {
  ModelEventType,
  ModelEventUpdate,
  ModelVibefireEvent,
  type Pageable,
  type TModelEventType,
  type TModelEventUpdate,
  type TModelVibefireEvent,
  type TVibefireGroup,
} from "@vibefire/models";
import {
  type TEventsRepository,
  type TGroupsRepository,
  type TPlansRepository,
  type TUsersRepository,
} from "@vibefire/services/fauna";
import {
  tbValidatorResult,
  trimAndCropText,
  type AsyncResult,
} from "@vibefire/utils";

import { ManagerRuleViolation } from "!managers/errors";
import { managerResult, unwrapNullablePromise } from "!managers/utils";

export class EventsUFManger {
  constructor(
    private readonly eventsRepo: TEventsRepository,
    private readonly usersRepo: TUsersRepository,
    private readonly groupsRepo: TGroupsRepository,
    private readonly plansRepo: TPlansRepository,
  ) {}

  private getGroup(groupId: string): Promise<TVibefireGroup> {
    return unwrapNullablePromise(
      this.groupsRepo.getById(groupId).result,
      "This group does not exist",
    );
  }

  private getUserProfile(userAid: string) {
    return unwrapNullablePromise(
      this.usersRepo.getUserProfile(userAid).result,
      "Your profile does not exist",
    );
  }

  private getEvent(eventId: string): Promise<TModelVibefireEvent> {
    return unwrapNullablePromise(
      this.eventsRepo.getById(eventId).result,
      "This event does not exist",
    );
  }

  private checkUserGroupManager(group: TVibefireGroup, userAid: string) {
    if (group.ownerAid !== userAid && !group.managerAids.includes(userAid)) {
      throw new ManagerRuleViolation("You do not manage this group");
    }
  }

  private checkUserEventOwner(event: TModelVibefireEvent, userAid: string) {
    if (event.ownerId !== userAid) {
      throw new ManagerRuleViolation("You do not manage this group");
    }
  }

  private async checkHasReachedDraftLimit(userAid: string, groupId?: string) {
    const drafts = await this.eventsRepo.allByOwnerByState(
      groupId ?? userAid,
      -1, // is draft
      6, // limit
    ).result;

    if (drafts.length >= 5) {
      throw new ManagerRuleViolation(
        groupId
          ? "Your group has too many draft events"
          : "You have too many draft events",
      );
    }
  }

  newEvent(p: {
    userAid: string;
    forGroupId?: string;
    title: string;
    type: TModelEventType["type"];
    private: boolean;
  }) {
    return managerResult(async () => {
      const eventTypes = ModelEventType.anyOf.map(
        (e) => e.properties.type.const,
      );
      if (!eventTypes.includes(p.type)) {
        throw new ManagerRuleViolation("You cannot create this event type");
      }

      // non-group event
      if (p.forGroupId === undefined && !p.private) {
        throw new ManagerRuleViolation(
          "You cannot create public events as an individual",
        );
      }

      const group = p.forGroupId ? await this.getGroup(p.forGroupId) : null;
      if (group) {
        if (group.group.type === "private" && !p.private) {
          throw new ManagerRuleViolation(
            "This group is private and cannot make public events",
          );
        }
        this.checkUserGroupManager(group, p.userAid);
      }

      await this.checkHasReachedDraftLimit(p.userAid, p.forGroupId);

      const title = tbValidatorResult(ModelVibefireEvent.properties.title)(
        trimAndCropText(p.title, 100),
      )
        .map(
          (value) => value,
          (err) => new ManagerRuleViolation(err.message),
        )
        .unwrap();

      const userProfile = await this.getUserProfile(p.userAid);

      const ownerName = group?.name ?? userProfile.name;

      const eventId = await this.eventsRepo.create(
        p.type,
        p.private,
        p.forGroupId ?? p.userAid,
        ownerName,
        p.forGroupId ? "group" : "user",
        title,
        DateTime.utc().toMillis(),
      ).result;

      return eventId;
    });
  }

  async newEventFromPrevious(p: {
    userAid: string;
    forGroupId?: string;
    previousEventId: string;
  }) {
    return managerResult(async () => {
      const viewEventRes = await this.viewEvent({
        userAid: p.userAid,
        eventId: p.previousEventId,
        scope: "manage",
      });
      const e = viewEventRes.unwrap();

      await this.checkHasReachedDraftLimit(p.userAid, p.forGroupId);

      // be pretty unlikey this happens
      if (p.forGroupId && e.ownerId !== p.forGroupId) {
        throw new ManagerRuleViolation("This event is not part of this group");
      }

      const eNewId = await this.eventsRepo.create(
        e.event.type,
        e.event.public,
        e.ownerId,
        e.ownerName,
        e.ownerType,
        e.title,
        DateTime.utc().toMillis(),
      ).result;

      const eNew = await this.getEvent(eNewId);

      // copy over the rest of the event
      eNew.times = e.times;
      eNew.location = e.location;
      eNew.images = e.images;
      eNew.event = e.event;

      // update the new event
      const updateEventRes = await this.updateEvent({
        userAid: p.userAid,
        eventId: eNewId,
        update: eNew,
      });
      updateEventRes.unwrap();

      return eNew;
    });
  }

  async eventsByUser(p: {
    userAid: string;
  }): AsyncResult<Pageable<PartialDeep<TModelVibefireEvent>>> {
    return managerResult<Pageable<TModelVibefireEvent>>(async () => {
      const { data, after: afterKey } = await this.eventsRepo.allByOwner(
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
    return managerResult<Pageable<PartialDeep<TModelVibefireEvent>>>(
      async () => {
        if (p.scope === "all" && !p.userAid) {
          throw new ManagerRuleViolation("You must be signed to view this");
        }

        const g = await this.getGroup(p.groupId);

        if (p.scope === "all") {
          this.checkUserGroupManager(g, p.userAid!);
        }

        const { data, after: afterKey } = await this.eventsRepo.allByOwner(
          p.groupId,
          10,
        ).result;
        return {
          data,
          afterKey,
          limit: 10,
        };
      },
    );
  }

  // todo: model incomeplete events, do this and fix the api
  // viewEventFromLink
  // then the updates, which now will be easy then ur close!

  async viewPlan(p: {
    userAid?: string;
    planId: string;
    scope: "manage" | "published";
  }) {
    return managerResult(async () => {
      if (p.scope === "manage" && !p.userAid) {
        throw new ManagerRuleViolation("You must be signed to view this");
      }
      const plan = await this.plansRepo.getById(p.planId).result; // check the owner of the plan
      const events = await this.eventsRepo.allByPlanByState(p.planId, 1).result;
    });
  }

  async viewEvent(p: {
    userAid?: string;
    eventId: string;
    scope: "manage" | "published";
  }) {
    return managerResult(async () => {
      if (p.scope === "manage" && !p.userAid) {
        throw new ManagerRuleViolation("You must be signed in to view this");
      }

      const e = await this.getEvent(p.eventId);

      if (p.scope == "manage") {
        if (e.ownerType == "group") {
          const g = await this.getGroup(e.ownerId);
          this.checkUserGroupManager(g, p.userAid!);
        } else {
          this.checkUserEventOwner(e, p.userAid!);
        }
      } else if (p.scope == "published") {
        if (e.state !== 1) {
          throw new ManagerRuleViolation("This event is not published");
        }
        if (e.event.public === false && !e.event.canView.includes(p.userAid!)) {
          throw new ManagerRuleViolation("This event is private");
        }
        // published and (public or private and can view)
      } else {
        throw new ManagerRuleViolation("Invalid scope");
      }

      return e;
    });
  }

  async updateEvent(p: {
    userAid: string;
    eventId: string;
    update: Partial<TModelEventUpdate>;
  }) {
    return managerResult(async () => {
      const e = await this.getEvent(p.eventId);

      this.checkUserEventOwner(e, p.userAid);

      const update = tbValidatorResult(ModelEventUpdate)(p.update)
        .map(
          (value) => value,
          (err) => new ManagerRuleViolation(err.message),
        )
        .unwrap();

      await this.eventsRepo.update(p.eventId, update).result;
    });
  }

  async updateEventVisibility(p: {
    userAid: string;
    eventId: string;
    update: "hidden" | "published";
  }) {}

  async updateEventLinkId(p: {
    userAid: string;
    eventId: string;
    update: "remove" | "regenerate";
  }) {}

  async updateEventPartOf(p: {
    userAid: string;
    eventId: string;
    update: "remove" | "set";
    planId?: string;
  }) {}

  async deleteEvent(p: { userAid: string; eventId: string }) {}

  async pageEvents(p: { pageHash: string }) {
    return managerResult<Pageable<TModelVibefireEvent>>(async () => {
      const { data, after: afterKey } = await this.eventsRepo.page(p.pageHash)
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
