import { fql, type Client, type QueryValue } from "fauna";

import {
  type TModelVibefireAccess,
  type TModelVibefireEvent,
  type TModelVibefireMembership,
  type TModelVibefireOwnership,
} from "@vibefire/models";

import { faunaAbortableQuery } from "./utils";

type EntityType = "event" | "group" | "timeline" | "plan";

export class FaunaFunctions {
  constructor(private readonly faunaClient: Client) {}

  // ownership

  ownershipByOwnerIdAndType(
    ownerId: string,
    ownerType: "user" | "group" | "organisation",
  ) {
    return faunaAbortableQuery<TModelVibefireOwnership>(
      this.faunaClient,
      fql`
        OwnershipByOwnerIdAndType(${ownerId}, ${ownerType})
      `,
    );
  }

  // view_entities

  entityIfUserCanManage<T extends QueryValue>(
    entityId: string,
    entityType: EntityType,
    userAid: string,
  ) {
    return faunaAbortableQuery<T>(
      this.faunaClient,
      fql`
        EntityIfUserCanManage(${entityId}, ${entityType}, ${userAid})
      `,
    );
  }

  entityIfUserCanView<T extends QueryValue>(
    entityId: string,
    entityType: EntityType,
    userAid?: string,
  ) {
    return faunaAbortableQuery<T>(
      this.faunaClient,
      fql`
        EntityIfUserCanView(${entityId}, ${entityType}, ${userAid ?? null})
      `,
    );
  }

  entityIfUserCanViewViaShare<T extends QueryValue>(
    entityId: string,
    entityType: EntityType,
    shareCode: string,
  ) {
    return faunaAbortableQuery<T>(
      this.faunaClient,
      fql`
        EntityIfCanViewViaShare(${entityId}, ${entityType}, ${shareCode})
      `,
    );
  }

  entitiesUserIsPart<T extends QueryValue>(
    entityType: EntityType,
    userAid: string,
  ) {
    return faunaAbortableQuery<T[]>(
      this.faunaClient,
      fql`
        EntitiesUserIsPart(${entityType}, ${userAid})
      `,
    );
  }

  // access_management

  createNewAccess(accessType: TModelVibefireAccess["type"], userAid: string) {
    return faunaAbortableQuery<TModelVibefireAccess>(
      this.faunaClient,
      fql`
        CreateNewAccess(${accessType}, ${userAid})
      `,
    );
  }

  setManagerForAccess(accessId: string, userAid: string, toSetUserAid: string) {
    return faunaAbortableQuery<TModelVibefireMembership>(
      this.faunaClient,
      fql`
        SetManagerForAccess(${accessId}, ${userAid}, ${toSetUserAid})
      `,
    );
  }

  setExpiryForAccess(
    accessId: string,
    userAid: string,
    toSetUserAid: string,
    epochExpires: number | null,
  ) {
    return faunaAbortableQuery<TModelVibefireMembership>(
      this.faunaClient,
      fql`
        SetExpiryForAccess(${accessId}, ${userAid}, ${toSetUserAid}, ${epochExpires})
      `,
    );
  }

  membershipsOfAccessIfUserCanManage(accessId: string, userAid: string) {
    return faunaAbortableQuery<TModelVibefireMembership[]>(
      this.faunaClient,
      fql`
        MembershipsOfAccessIfUserCanManage(${accessId}, ${userAid})
      `,
    );
  }

  // sharing_joining

  joinAccessWithShareCode(shareCode: string, userAid: string) {
    return faunaAbortableQuery<TModelVibefireMembership>(
      this.faunaClient,
      fql`
        JoinAccessWithShareCode(${shareCode}, ${userAid})
      `,
    );
  }

  accessShareCodeForUser(
    accessId: string,
    userAid: string,
    shareCode: string,
    update: boolean,
  ) {
    return faunaAbortableQuery<string>(
      this.faunaClient,
      fql`
        AccessShareCodeForUser(${accessId}, ${userAid}, ${shareCode}, ${update})
      `,
    );
  }

  // geo_query

  eventsGeoPeriodQuery(
    userAid: string | null,
    minLat: number,
    minLon: number,
    maxLat: number,
    maxLon: number,
    datePeriod: number,
  ) {
    return faunaAbortableQuery<{ data: TModelVibefireEvent[] }>(
      this.faunaClient,
      fql`
        EventsGeoPeriodQuery(${userAid ?? null}, ${minLat}, ${minLon}, ${maxLat}, ${maxLon}, ${datePeriod})
      `,
    );
  }
}
