import { DateTime } from "luxon";

import {
  ModelEventUpdate,
  ModelVibefireEventData,
  newVibefireEvent,
  tbClean,
  tbValidatorResult,
  type MapQueryT,
  type Pageable,
  type TModelEventUpdate,
  type TModelVibefireAccess,
  type TModelVibefireEvent,
  type TModelVibefireGroup,
  type TModelVibefireMembership,
  type TModelVibefireOwnership,
} from "@vibefire/models";
import {
  getCloudFlareImagesService,
  type CloudFlareImagesService,
} from "@vibefire/services/cloudflare-images";
import {
  getGoogleMapService,
  type GoogleMapsService,
} from "@vibefire/services/google-maps";
import {
  dateIndexesFor,
  isPositionEqual,
  ntzToDateTime,
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
    return new UFEventsManger(
      getReposManager(),
      getCloudFlareImagesService(),
      getGoogleMapService(),
    );
  });

export class UFEventsManger {
  constructor(
    private readonly repos: ReposManager,
    private readonly cfImages: CloudFlareImagesService,
    private readonly googleMaps: GoogleMapsService,
  ) {}

  createNewEvent(p: {
    userAid: string;
    forGroupId?: string;
    name: string;
    accessType: TModelVibefireAccess["type"];
  }): ManagerAsyncResult<string> {
    return managerReturn(async () => {
      const eventIsPublicType = p.accessType === "public";

      // non-group event
      if (p.forGroupId === undefined && eventIsPublicType) {
        throw new ManagerRuleViolation(
          "Public events can only be made through public groups",
        );
      }

      (
        await this.repos.checkHasReachedCreationLimit(p.userAid, p.forGroupId)
      ).unwrap();

      let accessRef: TModelVibefireAccess;
      let ownerRef: TModelVibefireOwnership;
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
        accessRef = g.accessRef;
        ownerRef = g.ownershipRef;
      } else {
        const u = (await this.repos.getUserProfile(p.userAid)).unwrap();
        accessRef = (
          await this.repos.access.create(p.accessType, p.userAid).result
        ).unwrap();
        ownerRef = u.ownershipRef;
      }

      const name = trimAndCropText(p.name, 100);

      const newEvent = newVibefireEvent({
        name,
        accessRef,
        ownerRef,
        epochCreated: DateTime.utc().toMillis(),
      });

      const { id: eventId } = await this.repos.event.create(newEvent).result;

      return eventId;
    });
  }

  createEventFromPrevious(p: {
    userAid: string;
    forGroupId?: string;
    previousEventId: string;
  }) {
    return managerReturn(async () => {
      const { event } = (
        await this.viewEvent({
          userAid: p.userAid,
          eventId: p.previousEventId,
          scope: "manage",
        })
      ).unwrap();

      (
        await this.repos.checkHasReachedCreationLimit(p.userAid, p.forGroupId)
      ).unwrap();

      let ownerRef: TModelVibefireOwnership;
      let accessRef: TModelVibefireAccess;
      if (p.forGroupId) {
        const g: TModelVibefireGroup = await this.repos.groupIfManager(
          p.forGroupId,
          p.userAid,
        );
        accessRef = g.accessRef;
        ownerRef = g.ownershipRef;
      } else {
        const u = (await this.repos.getUserProfile(p.userAid)).unwrap();
        accessRef = (
          await this.repos.access.create(event.accessRef.type, p.userAid).result
        ).unwrap();
        ownerRef = u.ownershipRef;
      }

      if (event.ownerRef.id !== ownerRef.id) {
        throw new ManagerRuleViolation(
          "You cannot copy an event you do not own",
        );
      }

      const newEvent = newVibefireEvent({
        ownerRef,
        accessRef,
        name: event.name,
        epochCreated: DateTime.utc().toMillis(),
      });
      const { id: newEventId } = await this.repos.event.create(newEvent).result;

      const newEventFetched = await this.repos.eventIfManager(
        newEventId,
        p.userAid,
      );

      // copy over the rest of the event
      newEventFetched.times = event.times;
      newEventFetched.location = event.location;
      newEventFetched.images = event.images;
      newEventFetched.details = event.details;

      // update the new event
      const updateEventRes = await this.updateEvent({
        userAid: p.userAid,
        eventId: newEventId,
        update: newEventFetched,
      });
      updateEventRes.unwrap();

      return newEventFetched.id;
    });
  }

  eventsUserIsPartOf(p: {
    userAid: string;
    scope: "manager" | "member";
    pageLimit?: number;
  }): ManagerAsyncResult<Pageable<PartialDeep<TModelVibefireEvent>>> {
    return managerReturn<Pageable<TModelVibefireEvent>>(async () => {
      const pageLimit = p.pageLimit ?? 10;

      if (p.scope !== "manager" && p.scope !== "member") {
        throw new Error(`Invalid scope: ${p.scope}`);
      }
      const { data, after: afterKey } =
        p.scope === "manager"
          ? await this.repos.event.allUserManagerOf(p.userAid, pageLimit).result
          : await this.repos.event.allUserMemberOf(p.userAid, pageLimit).result;

      return {
        data,
        afterKey,
        limit: pageLimit,
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
    eventId: string;
    scope: "published";
    shareCode?: string;
  }): ManagerAsyncResult<{
    event: TModelVibefireEvent;
    membership: TModelVibefireMembership;
  }>;
  viewEvent(p: {
    userAid?: string;
    eventId: string;
    scope: "manage";
  }): ManagerAsyncResult<{
    event: TModelVibefireEvent;
    membership: TModelVibefireMembership;
  }>;
  viewEvent(p: {
    userAid?: string;
    eventId: string; // taken to be the linkId when scope is "viaLink"
    scope: "manage" | "published";
    shareCode?: string;
  }): ManagerAsyncResult<{
    event: TModelVibefireEvent;
    membership: TModelVibefireMembership | null;
  }> {
    return managerReturn(async () => {
      let event: TModelVibefireEvent;
      switch (p.scope) {
        case "manage":
          if (!p.userAid) {
            throw new ManagerRuleViolation(
              "You must be signed in to view this",
            );
          }
          event = await this.repos.eventIfManager(p.eventId, p.userAid);
          break;
        case "published":
          event = await this.repos.eventIfViewer(
            p.eventId,
            p.userAid,
            p.shareCode,
          );
          break;
        default:
          throw new ManagerRuleViolation("Invalid scope");
      }
      event.ownerRef = await this.repos.getOwnershipRef(event.ownerRef.id);
      event.accessRef = await this.repos.getAccessRef(event.accessRef.id);
      const membership = (
        await this.repos.access.membershipForUser(event.accessRef.id, p.userAid)
          .result
      ).unwrap();
      return { event, membership };
    });
  }

  updateEvent(p: {
    userAid: string;
    eventId: string;
    update: Partial<TModelEventUpdate>;
  }) {
    return managerReturn(async () => {
      const e = await this.repos.eventIfManager(p.eventId, p.userAid);
      // const eManage = await this.repos.event.eventManagement(p.eventId);

      const update = tbClean(ModelEventUpdate, p.update);

      if (
        update.location?.position &&
        !isPositionEqual(update.location?.position, e.location?.position)
      ) {
        const tzInfo = await this.googleMaps.getTimezoneInfo(
          update.location.position,
          DateTime.now().toUnixInteger(),
        );
        update.times ??= {};
        update.times.timezone = tzInfo.timeZoneId;
        update.times.offsetSeconds = tzInfo.rawOffset;
      }

      if (
        update.times?.ntzStart &&
        update.times.ntzStart !== e.times?.ntzStart
      ) {
        update.times.datePeriods = dateIndexesFor(
          ntzToDateTime(update.times.ntzStart),
          0, // will come from management at some point
        );
      }

      const nextStart = update.times?.ntzStart ?? e.times.ntzStart;
      const nextEnd = update.times?.ntzEnd ?? e.times.ntzEnd;
      if (nextStart && nextEnd) {
        if (ntzToDateTime(nextStart) > ntzToDateTime(nextEnd)) {
          throw new ManagerRuleViolation("Start time must be before end time");
        }
      }

      // todo !
      if (update.images?.bannerImgKeys !== e.images?.bannerImgKeys) {
        // changes images, you could perpahs add outdated image to a dlete q
        // but only the keys are proviede here,
        // the actual upload must be hanlded by the client or elsewhere
        // could check the image exististststs to
      }

      const valdRes = tbValidatorResult(ModelVibefireEventData)(update);
      if (e.state === 1 && valdRes.isErr) {
        throw new ManagerRuleViolation(`Missing required fields in event`);
      }

      return (await this.repos.event.update(p.eventId, update)
        .result) as TModelVibefireEvent;
    });
  }

  updateEventVisibility(p: {
    userAid: string;
    eventId: string;
    update: "hide" | "publish";
  }) {
    return managerReturn(async () => {
      const e = await this.repos.eventIfManager(p.eventId, p.userAid);
      if (p.update === "hide") {
        await this.repos.event.update(p.eventId, {
          state: 0,
        }).result;
      } else if (p.update === "publish") {
        const valdRes = tbValidatorResult(ModelVibefireEventData)(e);
        if (valdRes.isErr) {
          throw new ManagerRuleViolation(`Missing required fields in event`);
        }
        await this.repos.event.update(p.eventId, {
          state: 1,
        }).result;
      } else {
        throw new Error(`Invalid visibility update - ${p.update}`);
      }
    });
  }

  updateEventAccess(p: {
    userAid: string;
    eventId: string;
    update: "open" | "invite";
  }) {
    return managerReturn(async () => {
      const e = await this.repos.eventIfManager(p.eventId, p.userAid);
      const acc = await this.repos.getAccessRef(e.accessRef.id);

      if (acc.type === p.update) {
        return;
      }

      if (p.update === "open") {
        await this.repos.access.makeAccessOpen(acc.id, p.userAid).result;
      } else if (p.update === "invite") {
        await this.repos.access.makeAccessInvite(acc.id, p.userAid).result;
      } else {
        throw new Error(`Invalid access type - ${p.update}`);
      }
    });
  }

  generateEventImageLink(p: { userAid: string; eventId: string }) {
    return managerReturn(async () => {
      const e = await this.repos.eventIfManager(p.eventId, p.userAid);

      return await this.cfImages.getUploadUrl({
        metadata: {
          eventId: p.eventId,
          ownershipId: e.ownerRef.id,
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

      const { data } = (
        await this.repos.event.geoPeriodQueryForUser(
          minLat,
          minLng,
          maxLat,
          maxLng,
          p.query.datePeriod,
          p.userAid,
        ).result
      ).unwrap();

      return data;
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
