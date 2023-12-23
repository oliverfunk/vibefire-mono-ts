import { Value } from "@sinclair/typebox/value";
import { Client } from "fauna";
import { DateTime } from "luxon";
import type { PartialDeep } from "type-fest";

import {
  VibefireEventManagementSchema,
  VibefireEventSchema,
  VibefireEventTimelineElementSchema,
  VibefireUserSchema,
  type MapQueryT,
  type VibefireEventImagesT,
  type VibefireEventLocationT,
  type VibefireEventT,
  type VibefireEventTimelineElementT,
  type VibefireUserInfoT,
} from "@vibefire/models";
import {
  type ClerkAuthContext,
  type ClerkSignedInAuthContext,
} from "@vibefire/services/clerk";
import {
  blockOrganiser,
  callAuthedEventsStarredOwnedDuringPeriods,
  callEventPublishedByLinkIdForExternalUser,
  callEventsInBBoxDuringPeriodForUser,
  createEvent,
  createEventManagement,
  createUser,
  deleteEvent,
  deleteUser,
  getEventFromIDByOrganiser,
  getEventFromLinkIdByOrganiser,
  getEventManagementFromEventIDByOrganiser,
  getEventsByOrganiser,
  getUserByAid,
  hideEvent,
  starEvent,
  unstarEvent,
  updateEvent,
  updateUserInfo,
} from "@vibefire/services/fauna";
import {
  displayPeriodsBetween,
  displayPeriodsFor,
  h3ToH3Parents,
  isoNTZToTZEpochSecs,
  latLngPositionToH3,
  nowAtUTC,
  removeUndef,
  tbValidator,
  trimAndCropText,
} from "@vibefire/utils";

import { managersContext } from "~/managers-context";
import { getImagesManager } from "~/private/images-manager";
import { getGoogleMapsManager } from "~/public/google-maps-manager";
import { checkUserIsPartOfOrg, safeGet } from "~/utils";

let _FaunaManager: FaunaManager | undefined;
export const getFaunaManager = (): FaunaManager => {
  "use strict";
  if (!_FaunaManager) {
    const faunaKey = managersContext().faunaClientKey!;
    _FaunaManager = new FaunaManager(faunaKey);
  }
  return _FaunaManager;
};

export class FaunaManager {
  private faunaClient: Client;
  constructor(faunaKey: string) {
    this.faunaClient = new Client({
      secret: faunaKey,
    });
  }
  // #region Event
  async eventsByUser(
    userAc: ClerkSignedInAuthContext,
    organisationId?: string,
  ) {
    checkUserIsPartOfOrg(userAc, organisationId);

    const organiserId = organisationId || userAc.userId;

    const res = await getEventsByOrganiser(this.faunaClient, organiserId);
    return res;
  }

  async eventForEdit(
    userAc: ClerkSignedInAuthContext,
    linkId: string,
    organisationId?: string,
  ) {
    checkUserIsPartOfOrg(userAc, organisationId);

    const organiserId = organisationId || userAc.userId;

    const e = await getEventFromLinkIdByOrganiser(
      this.faunaClient,
      linkId,
      organiserId,
    );
    if (!e) {
      throw new Error("Event not found");
    }

    return e;
  }

  async eventAllInfoForManagement(
    userAc: ClerkSignedInAuthContext,
    linkId: string,
    organisationId?: string,
  ) {
    checkUserIsPartOfOrg(userAc, organisationId);

    const organiserId = organisationId || userAc.userId;

    const event = await getEventFromLinkIdByOrganiser(
      this.faunaClient,
      linkId,
      organiserId,
    );
    if (!event) {
      throw new Error("Event not found");
    }
    const eventManage = await getEventManagementFromEventIDByOrganiser(
      this.faunaClient,
      event.id!,
      organiserId,
    );
    // const eOrg

    const e = tbValidator(VibefireEventSchema)(event);
    const em = tbValidator(VibefireEventManagementSchema)(eventManage);

    return {
      event: e,
      eventManagement: em,
    };
  }

  async publishedEventForExternalView(userAidOrAnon: string, linkId: string) {
    const e = await callEventPublishedByLinkIdForExternalUser(
      this.faunaClient,
      userAidOrAnon,
      linkId,
    );
    if (!e) {
      throw new Error("Event unavailable");
    }
    const event = tbValidator(VibefireEventSchema)(e);
    return event;
  }

  async eventCreate(
    userAc: ClerkSignedInAuthContext,
    title: VibefireEventT["title"],
    organisationId?: string,
  ) {
    checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    // check if the user is spamming create events
    // max 5 in draft, max 10 in draft or ready
    const organiserEvents = await getEventsByOrganiser(
      this.faunaClient,
      organiserId,
    );
    const draftEvents = organiserEvents.filter((e) => e.state === "draft");
    const readyEvents = organiserEvents.filter((e) => e.state === "ready");

    if (draftEvents.length >= 5) {
      throw new Error("Too many draft events");
    }
    if (draftEvents.length + readyEvents.length >= 10) {
      throw new Error("Too many draft or ready events");
    }

    const e = Value.Create(VibefireEventSchema);
    e.organiserId = organisationId || userAc.userId;

    title = tbValidator(VibefireEventSchema.properties.title)(
      trimAndCropText(title, 100),
    );
    e.title = title;

    if (organisationId === undefined) {
      // if the user is not part of an organisation, then they are creating
      // a user event, so set the type to user
      e.organiserType = "user";
      e.visibility = "link-only"; // by default
      const userInfo = await this.getUserInfo(userAc);
      e.organiserName = userInfo.name;
    } else {
      e.organiserType = "organisation";
      e.visibility = "public"; // by default
    }

    e.type = "one-time"; // by default
    e.linkId = crypto.randomUUID().slice(-9);
    e.dateCreatedUTC = nowAtUTC().toISO()!;
    e.dateUpdatedUTC = nowAtUTC().toISO()!;

    removeUndef(e);

    const res = await createEvent(this.faunaClient, e);
    return res;
  }

  async eventCreateFromPrevious(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    organisationId?: string,
  ) {
    checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    const e = await getEventFromIDByOrganiser(
      this.faunaClient,
      eventId,
      organiserId,
    );
    if (!e) {
      throw new Error("Event not found");
    }

    const newEvent = Value.Create(
      VibefireEventSchema,
    ) as PartialDeep<VibefireEventT>;

    newEvent.state = "draft";
    newEvent.published = false;
    newEvent.dateCreatedUTC = nowAtUTC().toISO()!;
    newEvent.dateUpdatedUTC = nowAtUTC().toISO()!;

    newEvent.organiserId = e.organiserId!;
    newEvent.organiserType = e.organiserType!;
    newEvent.organiserName = e.organiserName!;
    newEvent.visibility = e.visibility!;
    newEvent.type = e.type!;
    newEvent.linkId = crypto.randomUUID().slice(-9);
    newEvent.title = e.title!;

    newEvent.description = e.description;
    newEvent.tags = e.tags;
    newEvent.location = e.location;
    newEvent.timeZone = e.timeZone;
    newEvent.images = e.images;

    removeUndef(newEvent);

    const res = await createEvent(this.faunaClient, newEvent);
    return res;
  }

  async eventDelete(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    organisationId?: string,
  ) {
    checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    await deleteEvent(this.faunaClient, eventId, organiserId);
  }

  async eventUpdate(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    organisationId?: string,
    title?: VibefireEventT["title"],
    description?: VibefireEventT["description"],
    tags?: VibefireEventT["tags"],
    timeStartIsoNTZ?: string,
    timeEndIsoNTZ?: string | null,
    position?: VibefireEventLocationT["position"],
    addressDescription?: VibefireEventLocationT["addressDescription"],
    bannerImageId?: string,
    additionalImageIds?: string[],
    setTimeline: {
      id: string;
      timeIsoNTZ: string;
      message: string;
    }[] = [],
  ) {
    checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    const dbEvent = await safeGet(
      getEventFromIDByOrganiser(this.faunaClient, eventId, organiserId),
      "Event not found",
    );

    const updateData: PartialDeep<VibefireEventT> = {
      timeZone: dbEvent.timeZone,
      timeStartIsoNTZ: dbEvent.timeStartIsoNTZ,
      timeEndIsoNTZ: dbEvent.timeEndIsoNTZ,
      timeStart: dbEvent.timeStart,
      timeEnd: dbEvent.timeEnd,
    };

    // descriptions
    if (title || description || tags) {
      if (title) {
        title = tbValidator(VibefireEventSchema.properties.title)(
          trimAndCropText(title, 100),
        );
        updateData.title = title;
      }
      if (description) {
        description = tbValidator(VibefireEventSchema.properties.description)(
          trimAndCropText(description.trim(), 2000),
        );
        updateData.description = description;
      }
      if (tags) {
        tags = tags.map((t) => trimAndCropText(t, 20));
        tags = tbValidator(VibefireEventSchema.properties.tags)(tags);
        updateData.tags = tags;
      }
    }

    // times
    if (timeStartIsoNTZ || timeEndIsoNTZ !== undefined) {
      const tz = updateData.timeZone ?? "utc";

      if (timeStartIsoNTZ) {
        timeStartIsoNTZ = tbValidator(
          VibefireEventSchema.properties.timeStartIsoNTZ,
        )(timeStartIsoNTZ);
        updateData.timeStartIsoNTZ = timeStartIsoNTZ;
        updateData.timeStart = isoNTZToTZEpochSecs(timeStartIsoNTZ, tz);
      }

      if (timeEndIsoNTZ !== undefined) {
        if (timeEndIsoNTZ === null) {
          updateData.timeEndIsoNTZ = null;
          updateData.timeEnd = null;
        } else {
          timeEndIsoNTZ = tbValidator(
            VibefireEventSchema.properties.timeEndIsoNTZ,
          )(timeEndIsoNTZ);
          updateData.timeEndIsoNTZ = timeEndIsoNTZ;
          updateData.timeEnd = isoNTZToTZEpochSecs(timeEndIsoNTZ!, tz);
        }
      }

      updateData.displayTimePeriods = displayPeriodsBetween(
        updateData.timeStartIsoNTZ!,
        updateData.timeEndIsoNTZ,
      );

      if (updateData.timeStart && updateData.timeEnd) {
        if (updateData.timeStart >= updateData.timeEnd) {
          throw new Error("timeStart must be before timeEnd");
        }
      }
    }

    // location
    if (position || addressDescription) {
      const updateLocation: Partial<VibefireEventLocationT> = {};
      if (position) {
        position = tbValidator(
          VibefireEventSchema.properties.location.properties.position,
        )(position);

        // update h3's
        const { h3, h3Dec } = latLngPositionToH3(position);
        const { h3ParentsDec } = h3ToH3Parents(h3);

        // could validate h3's but nah
        updateLocation.position = position;
        updateLocation.h3 = h3Dec;
        updateLocation.h3Parents = h3ParentsDec;

        // get timezone based on new position
        // const tzLookupTS = async () => {
        //   if (updateData.timeStart) {
        //     return updateData.timeStart;
        //   }
        //   if (updateData.timeStartIsoNTZ) {
        //     return DateTime.fromISO(updateData.timeStartIsoNTZ).toUnixInteger();
        //   }
        // };
        const googleMapsManager = getGoogleMapsManager();
        // todo: if updateData.timeStart  is undef. and isoNTZ is def.
        // lookup the tz using DT.now(), then use that tz
        // to set the correct timestamp, then lookup again

        const posTZ = await googleMapsManager.getTimeZoneFromPosition(
          position,
          updateData.timeStart ?? DateTime.now().toUnixInteger(),
        );

        if (updateData.timeStartIsoNTZ) {
          updateData.timeStart = isoNTZToTZEpochSecs(
            updateData.timeStartIsoNTZ,
            posTZ,
          );
        }

        if (updateData.timeEndIsoNTZ) {
          updateData.timeEnd = isoNTZToTZEpochSecs(
            updateData.timeEndIsoNTZ,
            posTZ,
          );
        }

        updateData.timeZone = posTZ;
      }
      if (addressDescription) {
        updateLocation.addressDescription = tbValidator(
          VibefireEventSchema.properties.location.properties.addressDescription,
        )(trimAndCropText(addressDescription, 500));
      }
      updateData.location = updateLocation;
    }

    // images
    if (bannerImageId || additionalImageIds) {
      const updateImages: PartialDeep<VibefireEventImagesT> = {};
      if (bannerImageId) {
        bannerImageId = tbValidator(
          VibefireEventSchema.properties.images.properties.banner,
        )(bannerImageId);
        updateImages.banner = bannerImageId;
      }
      if (additionalImageIds) {
        additionalImageIds = tbValidator(
          VibefireEventSchema.properties.images.properties.additional,
        )(additionalImageIds);
        updateImages.additional = additionalImageIds;
      }
      updateData.images = updateImages;
      // todo: remove unused images
    }

    // timeline
    if (setTimeline.length > 0) {
      const updateTimeline: VibefireEventTimelineElementT[] = [];
      for (const el of setTimeline) {
        let tle = Value.Create(VibefireEventTimelineElementSchema);
        tle.id = el.id;
        tle.timeIsoNTZ = el.timeIsoNTZ;
        tle.message = trimAndCropText(el.message, 500);
        tle = tbValidator(VibefireEventTimelineElementSchema)(tle);
        updateTimeline.push(tle);
      }
      updateData.timeline = updateTimeline;
    }

    updateData.dateUpdatedUTC = nowAtUTC().toISO()!;

    removeUndef(updateData);

    const updatedEvent = await updateEvent(
      this.faunaClient,
      eventId,
      organiserId,
      updateData,
    );

    console.log(JSON.stringify(updatedEvent, null, 2));

    if (updatedEvent.state === "draft") {
      await this._setEventReadyIfPossible(
        organiserId,
        updatedEvent,
        updatedEvent.organiserType === "user",
      );
    }
  }

  async _setEventReadyIfPossible(
    organiserId: string,
    e: PartialDeep<VibefireEventT>,
    publish = false,
  ) {
    let event;
    try {
      event = tbValidator(VibefireEventSchema)(e);
    } catch (e) {
      console.log("event is invalid", e);
      return;
    }

    // create management doc based on event type
    let em = Value.Create(VibefireEventManagementSchema);

    em.id = ""; // temporary to pass validation
    em.eventId = event.id;
    em.organiserId = event.organiserId;
    em.organiserType = event.organiserType;

    removeUndef(em, false);

    // should validate successfully
    em = tbValidator(VibefireEventManagementSchema)(em);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: id must be unset here.
    em.id = undefined;

    await createEventManagement(this.faunaClient, em);

    const updateData: Partial<VibefireEventT> = {
      state: "ready",
    };
    if (publish) {
      updateData.published = false;
    }

    updateData.dateUpdatedUTC = nowAtUTC().toISO()!;

    removeUndef(updateData);

    await updateEvent(this.faunaClient, event.id, organiserId, updateData);
  }

  async generateEventImageUploadLink(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    organisationId?: string,
  ): Promise<{
    id: string;
    uploadURL: string;
  }> {
    const imageManager = getImagesManager();

    checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    return await imageManager.eventUploadUrl(eventId, organiserId);
  }

  async eventUpdateTimelineLinkPOI(
    userAc: ClerkSignedInAuthContext,
    poiId: string,
    timelineElementId: string,
  ) {}

  async eventSetPublished(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    organisationId?: string,
  ): Promise<void> {
    checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    const e = await getEventFromIDByOrganiser(
      this.faunaClient,
      eventId,
      organiserId,
    );
    const event = tbValidator(VibefireEventSchema)(e);

    if (event.state !== "ready") {
      throw new Error("Cannot publish, event is not 'ready'");
    }

    const updateData: Partial<VibefireEventT> = {
      published: true,
    };

    removeUndef(updateData);

    await updateEvent(this.faunaClient, eventId, organiserId, updateData);
  }

  async eventSetUnpublished(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    organisationId?: string,
  ): Promise<void> {
    checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    const updateData: Partial<VibefireEventT> = {
      published: false,
    };

    removeUndef(updateData);

    await updateEvent(this.faunaClient, eventId, organiserId, updateData);
  }

  async eventSetVisibility(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    visibility: VibefireEventT["visibility"],
    organisationId?: string,
  ): Promise<void> {
    checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    const updateData: Partial<VibefireEventT> = {
      visibility,
    };

    removeUndef(updateData);

    await updateEvent(this.faunaClient, eventId, organiserId, updateData);
  }

  async eventsFromStarredOwnedInPeriodForUser(
    userAc: ClerkSignedInAuthContext,
    onDateIsoNTZ: string,
    isUpcoming: boolean,
  ) {
    const queryPeriods = displayPeriodsFor(onDateIsoNTZ, isUpcoming ? 7 : 1);
    const res = await callAuthedEventsStarredOwnedDuringPeriods(
      this.faunaClient,
      userAc.userId,
      queryPeriods,
    );
    // todo: do fauna side
    const resFiltered = res.filter(
      (event, index, self) =>
        self.findIndex((e) => e.id === event.id) === index,
    );
    return resFiltered;
  }

  async eventsFromMapQuery(userAc: ClerkAuthContext, query: MapQueryT) {
    const { northEast, southWest, timePeriod, zoomLevel } = query;

    // console.log();
    // console.log("timePeriod", timePeriod);
    // console.log("northEast", JSON.stringify(northEast, null, 2));
    // console.log("southWest", JSON.stringify(southWest, null, 2));
    // console.log("zoomLevel", zoomLevel);
    // console.log();
    // console.log("lats delta", Math.abs(northEast.lat - southWest.lat));
    // console.log("longs delta", Math.abs(northEast.lng - southWest.lng));
    // console.log();

    // const h3Res = zoomLevelToH3Resolution(zoomLevel);

    // const bboxH3s = polygonToCells(
    //   [
    //     [northEast.lat, northEast.lng],
    //     [northEast.lat, southWest.lng],
    //     [southWest.lat, southWest.lng],
    //     [southWest.lat, northEast.lng],
    //   ],
    //   h3Res,
    // );

    // const bboxH3sComp = compactCells(bboxH3s);

    // console.log("bboxH3sPre no", bboxH3sPre.length);
    // console.log("bboxH3s no", bboxH3s.length);

    // const h3ps = bboxH3s.map((h3) => hexToDecimal(h3));
    // const res = await callEventsInAreasDuringPeriodForUser(
    //   this.faunaClient,
    //   userAc.userId ?? "anon",
    //   timePeriod,
    //   h3ps,
    // );
    const res = await callEventsInBBoxDuringPeriodForUser(
      this.faunaClient,
      userAc.userId ?? "anon",
      timePeriod,
      northEast,
      southWest,
    );

    // the extent to which this is necessary is questionable,
    // given the data comes from our db,
    // esp given the critical path nature of this function
    let events = res.map((eventData) =>
      tbValidator(VibefireEventSchema)(eventData),
    );

    // todo: optimise this by doing it fauna side
    if (userAc.userId) {
      const userInfo = await this.getUserInfo(userAc);
      const hiddenEvents = userInfo.hiddenEvents ?? [];
      const blockedOrganisers = userInfo.blockedOrganisers ?? [];

      events = events.filter((e) => {
        if (hiddenEvents.includes(e.id)) {
          return false;
        }
        if (blockedOrganisers.includes(e.organiserId)) {
          return false;
        }
        return true;
      });
    }

    console.log("events.length", events.length);

    return events;
  }

  // #endregion

  // #region User
  async userCreate(
    aid: string,
    firstName: string,
    primaryEmail: string | undefined,
    primaryPhone: string | undefined,
    birthdayISO: string | undefined,
  ) {
    if (!aid) {
      throw new Error("aid is required");
    }
    if (firstName.length < 2) {
      throw new Error("firstName must be at least 2 characters long");
    }

    firstName = trimAndCropText(firstName, 100);

    if (primaryEmail) {
      primaryEmail = tbValidator(VibefireUserSchema.properties.contactEmail)(
        trimAndCropText(primaryEmail, 500),
      );
    }
    if (primaryPhone) {
      primaryPhone = tbValidator(VibefireUserSchema.properties.phoneNumber)(
        trimAndCropText(primaryPhone, 100),
      );
    }

    const dateOfBirth = birthdayISO
      ? DateTime.fromISO(birthdayISO).toISODate() ?? undefined
      : undefined;

    const u = Value.Create(VibefireUserSchema);

    u.aid = aid;
    u.name = firstName;
    u.contactEmail = primaryEmail;
    u.phoneNumber = primaryPhone;
    u.dateOfBirth = dateOfBirth;

    removeUndef(u);

    const res = await createUser(this.faunaClient, u);
    return res;
  }

  async getUserInfo(userAc: ClerkSignedInAuthContext) {
    const retries = 3;
    const retryTimeout = 2000;

    let res = await getUserByAid(this.faunaClient, userAc.userId);
    if (!res) {
      for (let i = 0; i < retries; i++) {
        await new Promise((resolve) => setTimeout(resolve, retryTimeout));
        res = await getUserByAid(this.faunaClient, userAc.userId);
      }
    }

    if (!res) {
      throw new Error("User not found");
    }

    res = tbValidator(VibefireUserSchema)(res);
    return res;
  }

  async updateUserInfo(
    userAc: ClerkSignedInAuthContext,
    userInfo: Partial<VibefireUserInfoT>,
  ) {
    const res = await updateUserInfo(this.faunaClient, userAc.userId, userInfo);
    return res;
  }

  async deleteUser(userAc: ClerkSignedInAuthContext) {
    const res = await deleteUser(this.faunaClient, userAc.userId);
    return res;
  }

  async setStarEventForUser(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    starIt: boolean,
  ) {
    if (starIt) {
      await starEvent(this.faunaClient, userAc.userId, eventId);
    } else {
      await unstarEvent(this.faunaClient, userAc.userId, eventId);
    }
  }

  async hideEventForUser(userAc: ClerkSignedInAuthContext, eventId: string) {
    await hideEvent(this.faunaClient, userAc.userId, eventId);
  }

  async blockOrganiserForUser(
    userAc: ClerkSignedInAuthContext,
    organiserId: string,
  ) {
    if (organiserId === userAc.userId) {
      throw new Error("Cannot block yourself");
    }
    await blockOrganiser(this.faunaClient, userAc.userId, organiserId);
  }
  // #endregion
}
