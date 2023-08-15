import { Client, DateStub, Document, fql } from "fauna";

import { VibefireUser } from "@vibefire/models";

import { CreateCollectionIfDne, dfq } from "../utils";

type UserInfo = Pick<
  VibefireUser,
  "name" | "phoneNumber" | "contactEmail" | "dateOfBirth"
>;

export const createUsersCollection = async (faunaClient: Client) =>
  await dfq(faunaClient, CreateCollectionIfDne("Users"));

export const createUsersUniqueConstraints = async (faunaClient: Client) => {
  const aidField: keyof VibefireUser = "aid";
  const q = fql`
    Users.definition.update({
      constraints: [
        { unique: [ ${aidField} ] }
      ]
    })
  `;
  return await dfq(faunaClient, q);
};

export const createWithAidIndex = async (faunaClient: Client) => {
  const aidField: keyof VibefireUser = "aid";
  const q = fql`
    Users.definition.update({
      indexes: {
        withAid: {
          terms: [{ field: ${aidField} }],
        }
      }
    })
  `;
  return await dfq(faunaClient, q);
};

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
  return await dfq<{ id: string }>(faunaClient, q);
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
    Users.withAid(${aid}).update(${userSerialized}) {
      id
    }
  `;
  return await dfq<{ id: string }>(faunaClient, q);
};

export const deleteUser = async (faunaClient: Client, aid: string) => {
  const q = fql`
    Users.withAid(${aid}).delete()
  `;
  return await dfq<{ id: string }>(faunaClient, q);
};

export const addFollowedEvent = async (
  faunaClient: Client,
  aid: string,
  eventId: string,
) => {
  const q = fql`
    let u = Users.withAid(${aid})
    let updatedFollowedEvents = u?.followedEvents.append([${eventId}]).distinct()
    u?.update({ followedEvents: updatedFollowedEvents })
  `;
  return await dfq(faunaClient, q);
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
