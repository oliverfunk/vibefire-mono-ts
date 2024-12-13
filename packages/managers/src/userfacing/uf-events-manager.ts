import { DateTime } from "luxon";

import {
  ModelEventUpdate,
  newVibefireEvent,
  tbClean,
  tbValidator,
  type MapQueryT,
  type Pageable,
  type TModelEventUpdate,
  type TModelVibefireAccess,
  type TModelVibefireEvent,
  type TModelVibefireGroup,
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
  displayPeriodsFor,
  isoNTZToTZDateTime,
  isoNTZToUTCDateTime,
  isPositionEqual,
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
        await this.repos.checkHasReachedDraftLimit(p.userAid, p.forGroupId)
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
          await this.repos.access.createAccess(p.accessType, p.userAid).result
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
      const event = (
        await this.viewEvent({
          userAid: p.userAid,
          eventId: p.previousEventId,
          scope: "manage",
        })
      ).unwrap();

      (
        await this.repos.checkHasReachedDraftLimit(p.userAid, p.forGroupId)
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
          await this.repos.access.createAccess(event.accessRef.type, p.userAid)
            .result
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
          event = await this.repos.eventIfViewer(p.eventId, p.userAid);
          // case "viaLink":
          //   if (!isValidUuidV4(p.eventId)) {
          //     throw new ManagerRuleViolation("Invalid event link id");
          //   }
          //   return (
          //     await this.repos.event.withLinkIdIfUserCanView(p.eventId, p.userAid)
          //       .result
          //   ).unwrap();
          break;
        default:
          throw new ManagerRuleViolation("Invalid scope");
      }
      const ownerRef = await this.repos.access.ownershipWithId(
        event.ownerRef.id,
      ).result;
      if (!ownerRef) {
        throw new ManagerRuleViolation("Event owner not found");
      }
      event.ownerRef = ownerRef;
      return event;
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

      const delta = tbClean(ModelEventUpdate, p.update);
      const prior = tbClean(ModelEventUpdate, e);
      const next = tbValidator(ModelEventUpdate)({ ...prior, ...delta });

      if (!next.times) {
        next.times = {};
      }

      if (
        !isPositionEqual(next.location?.position, prior.location?.position) &&
        next.location?.position
      ) {
        const tzInfo = await this.googleMaps.getTimezoneInfo(
          next.location?.position,
          DateTime.now().toUnixInteger(),
        );
        next.times.timezone = tzInfo.timeZoneId;
        next.times.offsetSeconds = tzInfo.rawOffset;
      }

      if (next.times.ntzStart !== prior.times?.ntzStart) {
        // if somehow the start time was cleared, clear the periods
        next.times.datePeriods = next.times.ntzStart
          ? dateIndexesFor(
              isoNTZToUTCDateTime(next.times.ntzStart),
              0, // that day only
            )
          : [];
      }

      if (next.times.ntzStart && next.times.ntzEnd) {
        if (
          isoNTZToUTCDateTime(next.times.ntzStart) >
          isoNTZToUTCDateTime(next.times.ntzEnd)
        ) {
          throw new ManagerRuleViolation("Start time must be before end time");
        }
      }

      // todo !
      if (next.images?.bannerImgKeys !== prior.images?.bannerImgKeys) {
      }

      // changes images, you could perpahs add outdated image to a dlete q
      // but only the keys are proviede here,
      // the actual upload must be hanlded by the client or elsewhere
      // could check the image exististststs to

      return (await this.repos.event.update(p.eventId, next)
        .result) as TModelVibefireEvent;
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
