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

  ownershipByOwnerIdAndType(ownerId: string, ownerType: "user" | "group") {
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

  entityIfUserCanViewWithShareCode<T extends QueryValue>(
    entityId: string,
    entityType: EntityType,
    shareCode: string,
  ) {
    return faunaAbortableQuery<T>(
      this.faunaClient,
      fql`
        EntityIfCanViewWithShareCode(${entityId}, ${entityType}, ${shareCode})
      `,
    );
  }

  entitiesUserIsManagerOf<T extends QueryValue>(
    entityType: EntityType,
    userAid: string,
  ) {
    return faunaAbortableQuery<T[]>(
      this.faunaClient,
      fql`
        EntitiesUserIsManagerOf(${entityType}, ${userAid})
      `,
    );
  }

  entitiesUserIsMemberOf<T extends QueryValue>(
    entityType: EntityType,
    userAid: string,
  ) {
    return faunaAbortableQuery<T[]>(
      this.faunaClient,
      fql`
        EntitiesUserIsMemberOf(${entityType}, ${userAid})
      `,
    );
  }

  // access_management

  createNewAccess(
    accessType: TModelVibefireAccess["accessType"],
    ownership: TModelVibefireOwnership,
    userAid: string,
    shareCode: string,
  ) {
    return faunaAbortableQuery<TModelVibefireAccess>(
      this.faunaClient,
      fql`
        CreateNewAccess(${accessType}, ${ownership}, ${userAid}, ${shareCode})
      `,
    );
  }

  makeAccessOpen(accessId: string, userAid: string) {
    return faunaAbortableQuery<TModelVibefireAccess>(
      this.faunaClient,
      fql`
        MakeAccessOpen(${accessId}, ${userAid})
      `,
    );
  }

  makeAccessInvite(accessId: string, userAid: string) {
    return faunaAbortableQuery<TModelVibefireAccess>(
      this.faunaClient,
      fql`
        MakeAccessInvite(${accessId}, ${userAid})
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

  membershipOfAccessForUser(accessId: string, userAid?: string) {
    return faunaAbortableQuery<TModelVibefireMembership | null>(
      this.faunaClient,
      fql`
        MembershipOfAccessForUser(${accessId}, ${userAid ?? null})
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

  joinAccess(
    accessId: string,
    userAid: string,
    shareCode: string | null,
    newMemberShareCode: string,
  ) {
    console.log(
      JSON.stringify(
        {
          accessId,
          userAid,
          shareCode,
          newMemberShareCode,
        },
        null,
        2,
      ),
    );
    return faunaAbortableQuery<TModelVibefireMembership>(
      this.faunaClient,
      fql`
        JoinAccessWithMaybeShareCode(${accessId}, ${userAid}, ${shareCode}, ${newMemberShareCode})
      `,
    );
  }

  leaveAccess(accessId: string, userAid: string) {
    return faunaAbortableQuery<null>(
      this.faunaClient,
      fql`
        LeaveAccess(${accessId}, ${userAid})
      `,
    );
  }

  shareCodeOfAccessForUser(
    accessId: string,
    userAid: string,
    shareCode: string,
    overwrite: boolean,
  ) {
    return faunaAbortableQuery<string>(
      this.faunaClient,
      fql`
        ShareCodeOfAccessForUser(${accessId}, ${userAid}, ${shareCode}, ${overwrite})
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
