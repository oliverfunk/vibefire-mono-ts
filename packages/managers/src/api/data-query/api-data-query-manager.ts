// import { createClient } from "@supabase/supabase-js";
import { Value } from "@sinclair/typebox/value";
import { Client } from "fauna";
import { DateTime } from "luxon";
import type { PartialDeep } from "type-fest";

import {
  VibefireEventManagementSchema,
  VibefireEventSchema,
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
  deleteUser,
  getEventFromIDByOrganiser,
  getUserByAid,
  updateEvent,
  updateUserInfo,
} from "@vibefire/services/fauna";
import {
  epochSecsAtNewTimeZone,
  h3ToH3Parents,
  hexToDecimal,
  isoStrToEpochSeconds,
  latLngPositionToH3,
  polygonToCells,
  removeUndef,
  tbValidator,
  zoomLevelToH3Resolution,
} from "@vibefire/utils";

import { safeGet } from "~/utils";
import { getGoogleMapsManager } from "..";
import { type GoogleMapsManager } from "../google-maps-manager";

export class ApiDataQueryManager {
  private googleMapsManager: GoogleMapsManager;
  private faunaClient: Client;
  // private supabaseClient: ReturnType<typeof createClient> | undefined;
  constructor(googleMapsApiKey: string, faunaKey: string) {
    this.googleMapsManager = getGoogleMapsManager(googleMapsApiKey);
    this.faunaClient = new Client({
      secret: faunaKey,
    });
    // this.supabaseClient = createClient(
    //   "https://hlfwftvznmtrejjxclvr.supabase.co",
    //   supabaseKey,
    //   { auth: { persistSession: false } },
    // );
  }

  _checkUserIsPartOfOrg(
    userAc: ClerkSignedInAuthContext,
    organisationId?: string,
  ) {
    if (organisationId !== undefined) {
      if (userAc.organization === undefined) {
        throw new Error("User is not part of an organization");
      }
      if (organisationId !== userAc.organization.id) {
        throw new Error("User is not part of that organization");
      }
      // check if the user has a role that is able to create events for the organization
    }
  }

  // #region Event
  async eventForManagement(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    organisationId?: string,
  ) {
    this._checkUserIsPartOfOrg(userAc, organisationId);

    const organiserId = organisationId || userAc.userId;

    const e = await getEventFromIDByOrganiser(
      this.faunaClient,
      eventId,
      organiserId,
    );

    return e;
  }

  async eventCreate(
    userAc: ClerkSignedInAuthContext,
    title: VibefireEventT["title"],
    organisationId?: string,
  ) {
    this._checkUserIsPartOfOrg(userAc, organisationId);

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
    } else {
      e.organiserType = "organisation";
      e.visibility = "public"; // by default
    }

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
    this._checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    const updateData: Partial<VibefireEventT> = {};

    if (title) {
      title = tbValidator(VibefireEventSchema.properties.title)(title);
      updateData.title = title;
    }
    if (description) {
      description = tbValidator(VibefireEventSchema.properties.description)(
        description,
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
    if (!(position && addressDescription)) {
      return { id: eventId };
    }

    this._checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    const e = await safeGet(
      getEventFromIDByOrganiser(this.faunaClient, eventId, organiserId),
      "Event not found",
    );

    const updateData: PartialDeep<VibefireEventT> = {
      timeZone: undefined,
      timeStart: undefined,
      timeEnd: undefined,
    };
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

      // could be made into its own function
      // inputs: position, e

      // get timezone based on new position
      const newTZ = await this.googleMapsManager.getTimeZoneInfoFromPosition(
        position,
        e.timeStart ?? DateTime.now().toUnixInteger(),
      );
      let oldTZ = e.timeZone;
      if (oldTZ === undefined) {
        oldTZ = newTZ;
      }

      // if the time zone has changed, update the times'
      // timezones (keeping the time the same)
      if (oldTZ !== newTZ) {
        updateData.timeZone = newTZ;
        if (e.timeStart) {
          updateData.timeStart = epochSecsAtNewTimeZone(
            e.timeStart,
            oldTZ,
            newTZ,
          );
        }
        if (e.timeEnd) {
          updateData.timeEnd = epochSecsAtNewTimeZone(e.timeEnd, oldTZ, newTZ);
        }
        // NB: shouldn't need to update display times
      }
    }
    if (addressDescription) {
      addressDescription = tbValidator(
        VibefireEventSchema.properties.location.properties.addressDescription,
      )(addressDescription);
      updateLocation.addressDescription = addressDescription;
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
    timeStart?: VibefireEventT["timeStart"] | string,
    timeEnd?: VibefireEventT["timeEnd"] | string,
    organisationId?: string,
  ) {
    if (!(timeStart && timeEnd)) {
      return;
    }

    this._checkUserIsPartOfOrg(userAc, organisationId);
    const organiserId = organisationId || userAc.userId;

    const e = await safeGet(
      getEventFromIDByOrganiser(this.faunaClient, eventId, organiserId),
      "Event not found",
    );

    if (e.timeZone === undefined) {
      throw new Error("A timezone/location must be set before setting times");
    }

    const updateData: Partial<VibefireEventT> = {
      timeStart: e.timeStart,
      timeEnd: e.timeEnd,
    };

    // could check if UTC iso string

    if (timeStart) {
      if (typeof timeStart === "string") {
        timeStart = isoStrToEpochSeconds(timeStart);
      }
      timeStart = tbValidator(VibefireEventSchema.properties.timeStart)(
        timeStart,
      );
      updateData.timeStart = timeStart;
    }
    if (timeEnd) {
      if (typeof timeEnd === "string") {
        timeEnd = isoStrToEpochSeconds(timeEnd);
      }
      timeEnd = tbValidator(VibefireEventSchema.properties.timeEnd)(timeEnd);
      updateData.timeEnd = timeEnd;
    }

    if (updateData.timeStart && updateData.timeEnd) {
      if (updateData.timeStart > updateData.timeEnd) {
        throw new Error("timeStart must be before timeEnd");
      }
    }

    removeUndef(updateData);

    await updateEvent(this.faunaClient, {
      id: eventId,
      organiserId,
      ...updateData,
    });
  }

  async eventUpdateSetBannerImage(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    update: Partial<Pick<VibefireEventImagesT, "banner">>,
  ) {}

  async eventUpdateSetAdditionalImages(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    update: Partial<Pick<VibefireEventImagesT, "additional">>,
  ) {}

  async eventUpdateTimeline(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    updateAdd: Pick<VibefireEventTimelineElementT, "when" | "message">[] = [],
    updateEdit: Pick<
      VibefireEventTimelineElementT,
      "id" | "when" | "message"
    >[] = [],
    updateRemove: Pick<VibefireEventTimelineElementT, "id">[] = [],
  ) {}

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
    this._checkUserIsPartOfOrg(userAc, organisationId);
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
    em.eventId = event.id;
    removeUndef(em);
    // should validate successfully
    em = tbValidator(VibefireEventManagementSchema)(em);
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
    this._checkUserIsPartOfOrg(userAc, organisationId);
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

    const events = res.map((eventData) =>
      tbValidator(VibefireEventSchema)(eventData),
    );

    console.log("events.length", events.length);

    return events;
  }

  // #endregion

  // #region User
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
