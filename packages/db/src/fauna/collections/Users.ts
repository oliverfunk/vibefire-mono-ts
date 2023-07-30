import { Client, DateStub, Document, fql } from "fauna";

import { VibefireUser } from "@vibefire/models";

type UserInfo = Pick<
  VibefireUser,
  "name" | "phoneNumber" | "contactEmail" | "dateOfBirth"
>;

export const createUser = async (
  faunaClient: Client,
  aid: string,
  userInfo: UserInfo,
) => {
  const ud: typeof userInfo &
    Pick<VibefireUser, "aid" | "followedEvents" | "followedOrganisations"> = {
    ...userInfo,
    aid,
    followedEvents: [],
    followedOrganisations: [],
  };
  const udSerialized = {
    ...ud,
    dateOfBirth:
      userInfo.dateOfBirth == undefined
        ? undefined
        : DateStub.fromDate(userInfo.dateOfBirth),
  };
  const q = fql`
    Users.create(${udSerialized}) {
      id
    }
  `;
  return (await faunaClient.query<{ id: string }>(q)).data;
};

export const updateUserInfo = async (
  faunaClient: Client,
  aid: string,
  userInfo: UserInfo,
) => {
  const userSerialized = {
    ...userInfo,
    dateOfBirth:
      userInfo.dateOfBirth == undefined
        ? undefined
        : DateStub.fromDate(userInfo.dateOfBirth),
  };
  const q = fql`
    Users.firstWhere(.aid == ${aid}).update(${userSerialized}) {
      id
    }
  `;
  return (await faunaClient.query<{ id: string }>(q)).data;
};

export const deleteUser = async (faunaClient: Client, aid: string) => {
  const q = fql`
    Users.firstWhere(.aid == ${aid}).delete()
  `;
  return (await faunaClient.query<{ id: string }>(q)).data;
};

export const addFollowedEvent = async (
  faunaClient: Client,
  aid: string,
  eventId: string,
) => {
  const q = fql`
    let u = Users.firstWhere(.aid == ${aid})
    let updatedFollowedEvents = u?.followedEvents.append([${eventId}]).distinct()
    u?.update({ followedEvents: updatedFollowedEvents })
  `;
  return (await faunaClient.query<{ id: string }>(q)).data;
};

// function userByEmail(email) {
//   return fql`Users.byEmail(${email}).first()`;
// )

// function updateUserByEmail(email, data) {
//   const user = userByEmail(email);
//   return fql`
//       let u = ${user}
//       u.update(${data})
//   `;
// }
