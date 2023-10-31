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
import { type ClerkSignedInAuthContext } from "@vibefire/services/clerk";
import {
  addFollowedEvent,
  callPublicEventsInPeriodInAreas,
  createEvent,
  createEventManagement,
  createUser,
  deleteUser,
  getEventFromIDByOrganiser,
  getEventManagementFromEventIDByOrganiser,
  getEventsByOrganiser,
  getPublishedEventFromID,
  getUserByAid,
  updateEvent,
  updateUserInfo,
} from "@vibefire/services/fauna";
import {
  h3ToH3Parents,
  hexToDecimal,
  isoNTZToTZEpochSecs,
  latLngPositionToH3,
  polygonToCells,
  removeUndef,
  tbValidator,
  zoomLevelToH3Resolution,
} from "@vibefire/utils";

import { getManagersContext } from "~/managers-context";
import { getImagesManager } from "~/private/images-manager";
import { getGoogleMapsManager } from "~/public/google-maps-manager";
import { checkUserIsPartOfOrg, safeGet } from "~/utils";

let _FaunaManager: FaunaManager | undefined;
export const getFaunaManager = (): FaunaManager => {
  "use strict";
  if (!_FaunaManager) {
    const faunaKey = getManagersContext().faunaClientKey!;
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
  async eventsByOrganiser(
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

    return e;
  }

  async eventAllInfoForManagement(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    organisationId?: string,
  ) {
    checkUserIsPartOfOrg(userAc, organisationId);

    const organiserId = organisationId || userAc.userId;

    const event = await getEventFromIDByOrganiser(
      this.faunaClient,
      eventId,
      organiserId,
    );
    const eventMang = await getEventManagementFromEventIDByOrganiser(
      this.faunaClient,
      eventId,
      organiserId,
    );
    // const eOrg

    const e = tbValidator(VibefireEventSchema)(event);
    const em = tbValidator(VibefireEventManagementSchema)(eventMang);

    return {
      event: e,
      eventManagement: em,
    };
  }

  async eventFromIDByOrganiser(
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
    const event = tbValidator(VibefireEventSchema)(e);

    return event;
  }

  async publishedEventForExternalView(userId: string, eventId: string) {
    const e = await getPublishedEventFromID(this.faunaClient, eventId);
    if (!e) {
      throw new Error("Event unavailable [1]");
    }
    const event = tbValidator(VibefireEventSchema)(e);

    const em = await getEventManagementFromEventIDByOrganiser(
      this.faunaClient,
      eventId,
      event.organiserId,
    );
    if (!em) {
      throw new Error("Event management unavailable");
    }
    const eventManagement = tbValidator(VibefireEventManagementSchema)(em);

    if (event.organiserType === "organisation") {
      // get the organisation profile data
    } else if (event.organiserType === "user") {
      // get the relevant user profile data
    } else {
      throw new Error("Unknown organiserType");
    }

    if (e.visibility === "invite-only") {
      if (userId === "anon") {
        throw new Error("User not signed in");
      }
      // check if the user has been added
      const rs = eventManagement.invited.find((i) => i === userId);
      if (!rs) {
        throw new Error("Event unavailable [2]");
      }
    }

    return event;
  }

  async eventCreate(
    userAc: ClerkSignedInAuthContext,
    title: VibefireEventT["title"],
    organisationId?: string,
  ) {
    checkUserIsPartOfOrg(userAc, organisationId);

    // check if the user is spamming create events
    // have say 5 in draft max

    const e = Value.Create(VibefireEventSchema);
    e.organiserId = organisationId || userAc.userId;
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

    removeUndef(e);

    const res = await createEvent(this.faunaClient, e);
    return res;
  }

  async eventUpdateDescriptions(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    title?: VibefireEventT["title"],
    description?: VibefireEventT["description"],
    tags?: VibefireEventT["tags"],
    organisationId?: string,
  ) {
    checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    const updateData: Partial<VibefireEventT> = {};

    if (title) {
      title = tbValidator(VibefireEventSchema.properties.title)(title);
      updateData.title = title;
    }
    if (description) {
      description = tbValidator(VibefireEventSchema.properties.description)(
        description.trim(),
      );
      updateData.description = description;
    }
    if (tags) {
      tags = tbValidator(VibefireEventSchema.properties.tags)(tags);
      updateData.tags = tags;
    }

    removeUndef(updateData);

    return await updateEvent(this.faunaClient, {
      id: eventId,
      organiserId,
      ...updateData,
    });
  }

  async eventUpdateLocation(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    position?: VibefireEventLocationT["position"],
    addressDescription?: VibefireEventLocationT["addressDescription"],
    organisationId?: string,
  ) {
    const googleMapsManager = getGoogleMapsManager();

    if (!(position && addressDescription)) {
      return { id: eventId };
    }

    checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    const dbE = await safeGet(
      getEventFromIDByOrganiser(this.faunaClient, eventId, organiserId),
      "Event not found",
    );

    const updateData: PartialDeep<VibefireEventT> = {};
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
      const posTZ = await googleMapsManager.getTimeZoneFromPosition(
        position,
        dbE.timeStart ?? DateTime.now().toUnixInteger(),
      );

      // todo: it's probabaly fine to assume utc if no timezone is found

      if (!posTZ) {
        throw new Error("Could not get timezone from position");
      }

      if (dbE.timeStartIsoNTZ && dbE.timeStart) {
        updateData.timeStart = isoNTZToTZEpochSecs(dbE.timeStartIsoNTZ, posTZ);
      }
      if (dbE.timeEndIsoNTZ && dbE.timeEnd) {
        updateData.timeEnd = isoNTZToTZEpochSecs(dbE.timeEndIsoNTZ, posTZ);
      }
      updateData.timeZone = posTZ;
    }

    if (addressDescription) {
      updateLocation.addressDescription = tbValidator(
        VibefireEventSchema.properties.location.properties.addressDescription,
      )(addressDescription.trim());
    }

    updateData.location = updateLocation;
    removeUndef(updateData);

    // ! NB: if e.state == 'ready', could merge updateData with e and validate

    return await updateEvent(this.faunaClient, {
      id: eventId,
      organiserId,
      ...updateData,
    });
  }

  async eventUpdateTimes(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    timeStartIsoNTZ?: string,
    timeEndIsoNTZ?: string | null,
    organisationId?: string,
  ) {
    if (!timeStartIsoNTZ || timeEndIsoNTZ === undefined) {
      return { id: eventId };
    }

    // todo: round the time to the nearest 15 mins

    checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    const e = await safeGet(
      getEventFromIDByOrganiser(this.faunaClient, eventId, organiserId),
      "Event not found",
    );

    if (e.timeZone === undefined) {
      throw new Error("A timezone/location must be set before setting times");
    }

    const tz = e.timeZone;

    const updateData: Partial<VibefireEventT> = {
      timeStart: e.timeStart,
      timeStartIsoNTZ: e.timeStartIsoNTZ,
      timeEnd: e.timeEnd,
      timeEndIsoNTZ: e.timeEndIsoNTZ,
    };

    // could check if UTC iso string

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

    if (updateData.timeStart && updateData.timeEnd) {
      if (updateData.timeStart >= updateData.timeEnd) {
        throw new Error("timeStart must be before timeEnd");
      }
    }

    removeUndef(updateData);

    return await updateEvent(this.faunaClient, {
      id: eventId,
      organiserId,
      ...updateData,
    });
  }

  async eventUpdateImages(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    bannerImageId?: string,
    additionalImageIds?: string[],
    organisationId?: string,
  ) {
    checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    const updateData: PartialDeep<VibefireEventT> = {};
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

    removeUndef(updateData);

    return await updateEvent(this.faunaClient, {
      id: eventId,
      organiserId,
      ...updateData,
    });
  }

  async eventImageUploadLink(
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

  async eventUpdateTimeline(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    setTimeline: {
      id: string;
      timeIsoNTZ: string;
      message: string;
    }[] = [],
    organisationId?: string,
  ) {
    checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    const e = await safeGet(
      getEventFromIDByOrganiser(this.faunaClient, eventId, organiserId),
      "Event not found",
    );
    // could use e to get the timezone to set a notification
    // also to check if has announced etc. for removed elements
    // but for now don't need it

    const updateData: PartialDeep<VibefireEventT> = {};
    const updateTimeline: VibefireEventTimelineElementT[] = [];

    for (const el of setTimeline) {
      let tle = Value.Create(VibefireEventTimelineElementSchema);
      tle.id = el.id;
      tle.timeIsoNTZ = el.timeIsoNTZ;
      tle.message = el.message.trim();
      tle = tbValidator(VibefireEventTimelineElementSchema)(tle);
      updateTimeline.push(tle);
    }

    updateData.timeline = updateTimeline;

    removeUndef(updateData);

    return await updateEvent(this.faunaClient, {
      id: eventId,
      organiserId,
      ...updateData,
    });
  }

  async eventUpdateTimelineLinkPOI(
    userAc: ClerkSignedInAuthContext,
    poiId: string,
    timelineElementId: string,
  ) {}

  async eventSetReady(
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
    const event = tbValidator(VibefireEventSchema)(e);

    if (event.state !== "draft") {
      throw new Error("Only events in draft can be set ready");
    }

    // create management doc based on event type
    let em = Value.Create(VibefireEventManagementSchema);

    em.id = ""; // temporary
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

    removeUndef(updateData);

    await updateEvent(this.faunaClient, {
      id: eventId,
      organiserId,
      ...updateData,
    });
  }

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

    await updateEvent(this.faunaClient, {
      id: eventId,
      organiserId,
      ...updateData,
    });
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

    await updateEvent(this.faunaClient, {
      id: eventId,
      organiserId,
      ...updateData,
    });
  }

  async eventFromId(eventId: string) {}

  async eventsFromMapQuery(query: MapQueryT) {
    const { northEast, southWest, timePeriod, zoomLevel } = query;

    console.log();
    console.log("timePeriod", timePeriod);
    console.log("northEast", JSON.stringify(northEast, null, 2));
    console.log("southWest", JSON.stringify(southWest, null, 2));
    console.log("zoomLevel", zoomLevel);
    console.log();
    console.log("lats delta", Math.abs(northEast.lat - southWest.lat));
    console.log("longs delta", Math.abs(northEast.lng - southWest.lng));
    console.log();

    // quadrantize the bbox, merge the cells, then query

    const h3Res = zoomLevelToH3Resolution(zoomLevel);

    const bboxH3sPre = polygonToCells(
      [
        [northEast.lat, northEast.lng],
        [northEast.lat, southWest.lng],
        [southWest.lat, southWest.lng],
        [southWest.lat, northEast.lng],
      ],
      h3Res,
    );

    // const bboxH3s = compactCells(bboxH3sPre);
    const bboxH3s = bboxH3sPre;
    if (!bboxH3s.length) {
      return [];
    }

    console.log("bboxH3sPre no", bboxH3sPre.length);
    console.log("bboxH3s no", bboxH3s.length);

    const h3ps = bboxH3s.map((h3) => hexToDecimal(h3));
    const res = await callPublicEventsInPeriodInAreas(
      this.faunaClient,
      timePeriod,
      h3ps,
    );

    console.log("res", JSON.stringify(res, null, 2));

    // the extent to which this is necessary is questionable,
    // given the data comes from our db,
    // esp given the critical path nature of this function
    const events = res.map((eventData) =>
      tbValidator(VibefireEventSchema)(eventData),
    );

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
    if (
      primaryEmail &&
      !Value.Check(VibefireUserSchema.properties.contactEmail, primaryEmail)
    ) {
      console.error("primaryEmail is invalid");
      primaryEmail = undefined;
    }
    if (
      primaryPhone &&
      !Value.Check(VibefireUserSchema.properties.phoneNumber, primaryPhone)
    ) {
      console.error("primaryPhone is invalid");
      primaryPhone = undefined;
    }

    const dateOfBirth = !!birthdayISO
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
    let res = await getUserByAid(this.faunaClient, userAc.userId);
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

  async addFollowedEvent(userAc: ClerkSignedInAuthContext, eventId: string) {
    const res = await addFollowedEvent(
      this.faunaClient,
      userAc.userId,
      eventId,
    );
    return res;
  }
  // #endregion
}
