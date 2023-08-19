// import { createClient } from "@supabase/supabase-js";
import { Client } from "fauna";
import { DateTime } from "luxon";

import {
  MapQueryT,
  VibefireEventImagesT,
  VibefireEventLocationT,
  VibefireEventSchema,
  VibefireEventT,
  VibefireEventTimelineElementT,
  VibefireUserInfoT,
} from "@vibefire/models";
import { type ClerkSignedInAuthContext } from "@vibefire/services/clerk";
import {
  addFollowedEvent,
  callPublicEventsInPeriodInAreas,
  createPublicEvent,
  createUser,
  deleteUser,
  updateUserInfo,
} from "@vibefire/services/fauna";
import {
  cellToParent,
  h3ToH3Parents,
  hexToDecimal,
  latLngPositionToH3,
  latLngToCell,
  polygonToCells,
  Replace,
  tbValidator,
  zoomLevelToH3Resolution,
} from "@vibefire/utils";

import { eventCreateTwo } from "./event";

export class DBServiceManager {
  private faunaClient: Client;
  // private supabaseClient: ReturnType<typeof createClient> | undefined;
  constructor(faunaKey: string, supabaseKey: string) {
    this.faunaClient = new Client({
      secret: faunaKey,
    });
    // this.supabaseClient = createClient(
    //   "https://hlfwftvznmtrejjxclvr.supabase.co",
    //   supabaseKey,
    //   { auth: { persistSession: false } },
    // );
  }

  public eventCreateTwo = eventCreateTwo;

  // #region Event
  async eventCreate(
    userAc: ClerkSignedInAuthContext,
    eventCreateData: VibefireEventT,
  ) {
    // todo: validate create data

    if (userAc.organization === undefined) {
      throw new Error("User is not part of an organization");
    }
    // if (userAc.organization. === undefined) {

    const { h3, h3Dec } = latLngPositionToH3(eventCreateData.location.position);
    const { h3ParentsDec } = h3ToH3Parents(h3);

    const eventData: Omit<VibefireEventT, "id"> = {
      organisationId: userAc.organization.id,

      type: "regular",
      title: "test event",
      description: "test event description",
      images: {
        banner: "",
      },
      timeStart: DateTime.now().millisecond,
      timeEnd: DateTime.now().millisecond,
      timeZone: "UTC+2",
      vibe: 0,

      timeline: [],
      offers: [],
      pois: [],
      tags: [],

      rank: Math.floor(Math.random() * 10),
      location: {
        position: eventCreateData.location.position,
        addressDescription: "Test place desc",
        h3: h3Dec,
        h3Parents: h3ParentsDec,
      },
      displayZoomGroup: 0,
      displayTimePeriods: [],
      published: true,
      visibility: "public",
    };
    const event = tbValidator(VibefireEventSchema)(eventData);

    const id1 = await createPublicEvent(this.faunaClient, event);
  }

  async eventUpdateDescriptions(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    update: Pick<VibefireEventT, "title" | "description" | "tags">,
  ) {}

  async eventUpdateTimes(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    update: Partial<
      Replace<
        Pick<VibefireEventT, "timeStart" | "timeEnd">,
        { timeStart: string; timeEnd: string }
      >
    >,
  ) {
    update;
  }

  async eventUpdateSetAdditionalImages(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    update: Partial<Pick<VibefireEventImagesT, "additional">>,
  ) {}

  async eventUpdateSetBannerImage(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    update: Partial<Pick<VibefireEventImagesT, "banner">>,
  ) {}

  async eventUpdateLocation(
    userAc: ClerkSignedInAuthContext,
    eventId: string,
    update: Partial<
      Pick<VibefireEventLocationT, "position" | "addressDescription">
    >,
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
  async createUser(
    userAc: ClerkSignedInAuthContext,
    userInfo: VibefireUserInfoT,
  ) {
    const res = await createUser(this.faunaClient, {
      ...userInfo,
      aid: userAc.userId,
      followedEvents: [],
      followedOrganisations: [],
      onboardingComplete: false,
    });
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
