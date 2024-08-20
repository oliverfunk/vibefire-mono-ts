import { DateTime } from "luxon";

import {
  newVibefireEntityAccess,
  newVibefireEvent,
  type AccessAction,
  type Pageable,
  type TModelEventType,
  type TModelEventUpdate,
  type TModelVibefireEvent,
} from "@vibefire/models";
import { type RepositoryService } from "@vibefire/services/fauna";
import {
  isValidUuidV4,
  randomDigits,
  trimAndCropText,
  type PartialDeep,
} from "@vibefire/utils";

import { ManagerRuleViolation } from "!managers/errors";
import { type ManagerAsyncResult } from "!managers/manager-result";
import { ReposManager } from "!managers/repos-manager";
import { managerReturn } from "!managers/utils";

// todo: model incomeplete events and fix the api
// todo: groups!
// map query geoPeriods!
// clean results from fauna servies

export class UFEventsManger {
  constructor(private readonly repos: ReposManager) {}

  static fromService(repoService: RepositoryService) {
    return new UFEventsManger(ReposManager.fromService(repoService));
  }

  createNewEvent(p: {
    userAid: string;
    forGroupId?: string;
    name: string;
    eventType: TModelEventType["type"];
  }) {
    return managerReturn(async () => {
      const eventIsPublicType = p.eventType === "event-public";
      let accAct: AccessAction | undefined = undefined;

      // non-group event
      if (p.forGroupId === undefined && eventIsPublicType) {
        throw new ManagerRuleViolation(
          "Public events can only be made through public groups",
        );
      }

      if (p.forGroupId) {
        const g = (
          await this.repos.group.withIdIfUserCanManage(p.forGroupId, p.userAid)
            .result
        ).unwrap();
        if (g.accessRef.type !== "public" && eventIsPublicType) {
          throw new ManagerRuleViolation(
            "This group is private and cannot make public events",
          );
        }
        accAct = { action: "link", accessId: g.accessRef.id };
      } else {
        accAct = {
          action: "create",
          access: newVibefireEntityAccess({ type: "invite" }), // default
          userId: p.userAid,
        };
      }

      (
        await this.repos.checkHasReachedDraftLimit(p.userAid, p.forGroupId)
      ).unwrap();

      const name = trimAndCropText(p.name, 100);

      const newEvent = newVibefireEvent({
        ownerId: p.forGroupId ?? p.userAid,
        ownerType: p.forGroupId ? "group" : "user",
        eventType: p.eventType,
        linkEnabled: true,
        linkId: crypto.randomUUID(),
        name,
        epochCreated: DateTime.utc().toMillis(),
      });
      const { id: eventId } = await this.repos.event.create(newEvent, accAct)
        .result;

      return eventId;
    });
  }

  async createEventFromPrevious(p: {
    userAid: string;
    forGroupId?: string;
    previousEventId: string;
  }) {
    return managerReturn(async () => {
      let accAct: AccessAction | undefined = undefined;

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

      if (p.forGroupId) {
        const g = (
          await this.repos.group.withIdIfUserCanManage(p.forGroupId, p.userAid)
            .result
        ).unwrap();
        accAct = { action: "link", accessId: g.accessRef.id };
      } else {
        accAct = {
          action: "create",
          access: newVibefireEntityAccess({
            type: event.accessRef.type,
          }),
          userId: p.userAid,
        };
      }

      const newEvent = newVibefireEvent({
        ownerId: event.ownerId,
        ownerType: event.ownerType,
        linkEnabled: true,
        linkId: crypto.randomUUID(),
        name: event.name,
        eventType: event.event.type,
        epochCreated: DateTime.utc().toMillis(),
      });
      const { id: newEventId } = await this.repos.event.create(newEvent, accAct)
        .result;

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

      return eNew.id;
    });
  }

  async eventsUserIsPart(p: {
    userAid: string;
  }): ManagerAsyncResult<Pageable<PartialDeep<TModelVibefireEvent>>> {
    return managerReturn<Pageable<TModelVibefireEvent>>(async () => {
      const { data, after: afterKey } = await this.repos.event.allUserIsPart(
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

  async eventsOwnedByGroup(p: {
    userAid: string;
    groupId: string;
    scope: "all";
  }): ManagerAsyncResult<Pageable<PartialDeep<TModelVibefireEvent>>>;
  async eventsOwnedByGroup(p: {
    userAid?: string;
    groupId: string;
    scope: "published";
  }): ManagerAsyncResult<Pageable<TModelVibefireEvent>>;
  async eventsOwnedByGroup(p: {
    userAid?: string;
    groupId: string;
    scope: "all" | "published";
  }) {
    return managerReturn<Pageable<PartialDeep<TModelVibefireEvent>>>(
      async () => {
        if (p.scope === "all" && !p.userAid) {
          throw new ManagerRuleViolation("You must be signed to view this");
        }

        if (p.scope === "all") {
          (
            await this.repos.group.withIdIfUserCanManage(p.groupId, p.userAid!)
              .result
          ).unwrap();
        }

        const limit = 10;
        const { data, after: afterKey } =
          p.scope === "all"
            ? await this.repos.event.allByOwner(p.groupId, limit).result
            : await this.repos.event.allByOwnerByState(
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

  async viewEvent(p: {
    userAid?: string;
    eventId: string; // taken to be the linkId when scope is "link"
    scope: "manage" | "published" | "link";
  }) {
    return managerReturn(async () => {
      switch (p.scope) {
        case "manage":
          if (!p.userAid) {
            throw new ManagerRuleViolation(
              "You must be signed in to view this",
            );
          }
          return (
            await this.repos.event.withIdIfUserCanManage(p.eventId, p.userAid)
              .result
          ).unwrap();
        case "published":
          return (
            await this.repos.event.withIdIfUserCanView(p.eventId, p.userAid)
              .result
          ).unwrap();
        case "link":
          if (!isValidUuidV4(p.eventId)) {
            throw new ManagerRuleViolation("Invalid event link id");
          }
          return (
            await this.repos.event.withLinkIdIfUserCanView(p.eventId, p.userAid)
              .result
          ).unwrap();
        default:
          throw new ManagerRuleViolation("Invalid scope");
      }
    });
  }

  async updateEvent(p: {
    userAid: string;
    eventId: string;
    update: Partial<TModelEventUpdate>;
  }) {
    return managerReturn(async () => {
      const e = (await this.repos.getEvent(p.eventId)).unwrap();

      (
        await this.repos.event.withIdIfUserCanManage(p.eventId, p.userAid)
          .result
      ).unwrap();

      // todo! : this is wildly insufficient
      // changing times means you need to udate peroids

      // what about changing postion
      // might not effect periods becuase start time is now string with
      // tz info, they only get one period (one day)

      // changes images, you could perpahs add outdated image to a dlete q
      // but only the keys are proviede here,
      // the actual upload must be hanlded by the client or elsewhere
      // could check the image exististststs to

      // we blindly trust the update here, as we assume
      // all inputs have been validated and sanitized
      await this.repos.event.update(p.eventId, p.update).result;
    });
  }

  async updateEventVisibility(p: {
    userAid: string;
    eventId: string;
    update: "hidden" | "published";
  }) {
    return managerReturn(async () => {
      (
        await this.repos.event.withIdIfUserCanManage(p.eventId, p.userAid)
          .result
      ).unwrap();

      const update: Partial<TModelVibefireEvent> = {
        state: p.update === "published" ? 1 : 0,
      };

      await this.repos.event.update(p.eventId, update).result;
    });
  }

  async updateEventToggleLinkEnabled(p: { userAid: string; eventId: string }) {
    return managerReturn(async () => {
      const e = (
        await this.repos.event.withIdIfUserCanManage(p.eventId, p.userAid)
          .result
      ).unwrap();

      const update: PartialDeep<TModelVibefireEvent> = {
        linkEnabled: !e.linkEnabled,
      };

      await this.repos.event.update(p.eventId, update).result;
    });
  }

  async deleteEvent(p: { userAid: string; eventId: string }) {
    return managerReturn(async () => {
      (
        await this.repos.event.withIdIfUserCanManage(p.eventId, p.userAid)
          .result
      ).unwrap();

      const update: Partial<TModelVibefireEvent> = {
        state: 3, // deleted
      };

      await this.repos.event.update(p.eventId, update).result;
    });
  }

  async pageEvents(p: { pageHash: string }) {
    return managerReturn<Pageable<TModelVibefireEvent>>(async () => {
      const { data, after: afterKey } = await this.repos.event.page(p.pageHash)
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
