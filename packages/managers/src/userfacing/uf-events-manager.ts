import { DateTime } from "luxon";

import {
  ModelEventUpdate,
  newVibefireEntityAccess,
  newVibefireEvent,
  tbClean,
  type AccessAction,
  type MapQueryT,
  type Pageable,
  type TModelEventType,
  type TModelEventUpdate,
  type TModelVibefireEvent,
  type TModelVibefireGroup,
} from "@vibefire/models";
import {
  getCloudFlareImagesService,
  type CloudFlareImagesService,
} from "@vibefire/services/cloudflare-images";
import {
  isValidUuidV4,
  resourceLocator,
  trimAndCropText,
  type PartialDeep,
} from "@vibefire/utils";

import { ManagerRuleViolation } from "!managers/errors";
import { type ManagerAsyncResult } from "!managers/manager-result";
import { getReposManager, type ReposManager } from "!managers/repos-manager";
import { managerReturn } from "!managers/utils";

// todo: model incomeplete events and fix the api
// todo: groups!
// clean results from fauna servies

// maybe think about updates (look at events, plans, groups etc.)
// groups should maybe follow the same array widget structure as events

export const ufEventsManagerSymbol = Symbol("ufEventsManagerSymbol");
export const getUFEventsManager = () =>
  resourceLocator().bindResource(ufEventsManagerSymbol, () => {
    return new UFEventsManger(getReposManager(), getCloudFlareImagesService());
  });

export class UFEventsManger {
  constructor(
    private readonly repos: ReposManager,
    private readonly cfImages: CloudFlareImagesService,
  ) {}

  createNewEvent(p: {
    userAid: string;
    forGroupId?: string;
    name: string;
    eventType: TModelEventType["type"];
  }): ManagerAsyncResult<string> {
    return managerReturn(async () => {
      const eventIsPublicType = p.eventType === "event-public";
      let accAct: AccessAction | undefined = undefined;

      // non-group event
      if (p.forGroupId === undefined && eventIsPublicType) {
        throw new ManagerRuleViolation(
          "Public events can only be made through public groups",
        );
      }

      let ownerName: string;
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
        ownerName = g.name;
      } else {
        accAct = {
          action: "create",
          access: newVibefireEntityAccess({ type: "invite" }), // default
          userId: p.userAid,
        };
        ownerName =
          (await this.repos.getUserProfile(p.userAid)).unwrap().name ?? "";
      }

      (
        await this.repos.checkHasReachedDraftLimit(p.userAid, p.forGroupId)
      ).unwrap();

      const name = trimAndCropText(p.name, 100);

      const newEvent = newVibefireEvent({
        ownerId: p.forGroupId ?? p.userAid,
        eventOwnerType: p.forGroupId ? "group" : "user",
        ownerName,
        eventType: p.eventType,
        linkEnabled: true,
        linkId: crypto.randomUUID(),
        name,
        epochCreated: DateTime.utc().toMillis(),
      });
      const { id: eventId } = await (
        await this.repos.event.create(newEvent, accAct)
      ).result;

      return eventId;
    });
  }

  createEventFromPrevious(p: {
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
        const g: TModelVibefireGroup = await this.repos.groupIfManager(
          p.forGroupId,
          p.userAid,
        );
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
        eventOwnerType: event.eventOwnerType,
        ownerName: event.ownerName,
        linkEnabled: true,
        linkId: crypto.randomUUID(),
        name: event.name,
        eventType: event.event.type,
        epochCreated: DateTime.utc().toMillis(),
      });
      const { id: newEventId } = await this.repos.event.create(newEvent, accAct)
        .result;

      const eNew = await this.repos.eventIfManager(newEventId, p.userAid);

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

  eventsUserIsPart(p: {
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

  eventsOwnedByGroup(p: {
    userAid: string;
    groupId: string;
    scope: "all";
  }): ManagerAsyncResult<Pageable<PartialDeep<TModelVibefireEvent>>>;
  eventsOwnedByGroup(p: {
    userAid?: string;
    groupId: string;
    scope: "published";
  }): ManagerAsyncResult<Pageable<TModelVibefireEvent>>;
  eventsOwnedByGroup(p: {
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
            ? await this.repos.event.allByOwner(p.groupId, "group", limit)
                .result
            : await this.repos.event.allByOwnerByState(
                p.groupId,
                "group",
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

  viewEvent(p: {
    userAid?: string;
    eventId: string; // taken to be the linkId when scope is "viaLink"
    scope: "manage" | "published" | "viaLink";
  }): ManagerAsyncResult<TModelVibefireEvent> {
    return managerReturn(async () => {
      switch (p.scope) {
        case "manage":
          if (!p.userAid) {
            throw new ManagerRuleViolation(
              "You must be signed in to view this",
            );
          }
          return await this.repos.eventIfManager(p.eventId, p.userAid);
        case "published":
          return await this.repos.eventIfViewer(p.eventId, p.userAid);
        case "viaLink":
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

  updateEvent(p: {
    userAid: string;
    eventId: string;
    update: Partial<TModelEventUpdate>;
  }) {
    return managerReturn(async () => {
      const update = tbClean(ModelEventUpdate, p.update);
      const _e = await this.repos.eventIfManager(p.eventId, p.userAid);

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
      console.log("update", JSON.stringify(update, null, 2));
      const a = await this.repos.event.update(p.eventId, update).result;
      console.log("a", JSON.stringify(a, null, 2));
    });
  }

  updateEventVisibility(p: {
    userAid: string;
    eventId: string;
    update: "hidden" | "published";
  }) {
    return managerReturn(async () => {
      await this.repos.eventIfManager(p.eventId, p.userAid);

      const update: Partial<TModelVibefireEvent> = {
        state: p.update === "published" ? 1 : 0,
      };

      await this.repos.event.update(p.eventId, update).result;
    });
  }

  updateEventToggleLinkEnabled(p: { userAid: string; eventId: string }) {
    return managerReturn(async () => {
      const e = await this.repos.eventIfManager(p.eventId, p.userAid);

      const update: PartialDeep<TModelVibefireEvent> = {
        linkEnabled: !e.linkEnabled,
      };

      await this.repos.event.update(p.eventId, update).result;
    });
  }

  generateEventImageLink(p: { userAid: string; eventId: string }) {
    return managerReturn(async () => {
      const e = await this.repos.eventIfManager(p.eventId, p.userAid);

      return await this.cfImages.getUploadUrl({
        metadata: {
          eventId: p.eventId,
          ownerId: e.ownerId,
          uploaderUserAid: p.userAid,
        },
      });
    });
  }

  deleteEvent(p: { userAid: string; eventId: string }) {
    return managerReturn(async () => {
      await this.repos.eventIfManager(p.eventId, p.userAid);

      const update: Partial<TModelVibefireEvent> = {
        state: 3, // deleted
      };

      await this.repos.event.update(p.eventId, update).result;
    });
  }

  queryEventsInGeoPeriods(p: { userAid?: string; query: MapQueryT }) {
    return managerReturn(async () => {
      const neLatGe = p.query.northEast.lat > p.query.southWest.lat;
      const neLngGe = p.query.northEast.lng > p.query.southWest.lng;

      const minLat = neLatGe ? p.query.southWest.lat : p.query.northEast.lat;
      const minLng = neLngGe ? p.query.southWest.lng : p.query.northEast.lng;
      const maxLat = neLatGe ? p.query.northEast.lat : p.query.southWest.lat;
      const maxLng = neLngGe ? p.query.northEast.lng : p.query.southWest.lng;

      const res = (
        await this.repos.event.geoPeriodQueryForUser(
          minLat,
          minLng,
          maxLat,
          maxLng,
          p.query.datePeriod,
          p.userAid,
        ).result
      ).unwrap();

      return res.data;
    });
  }

  pageEvents(p: { pageHash: string }) {
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
