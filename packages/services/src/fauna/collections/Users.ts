import { DateStub, fql, type Client } from "fauna";

import {
  type VibefireUserInfoT,
  type VibefireUserNoIdT,
  type VibefireUserT,
} from "@vibefire/models";

import { CreateCollectionIfDne, dfq } from "../utils";

export const defineUsersCollection = async (faunaClient: Client) => {
  await dfq(faunaClient, CreateCollectionIfDne("Users"));
};

export const defineUsersUniqueConstraints = async (faunaClient: Client) => {
  const aidField: keyof VibefireUserT = "aid";
  const q = fql`
    Users.definition.update({
      constraints: [
        { unique: [ ${aidField} ] }
      ]
    })
  `;
  await dfq(faunaClient, q);
};

export const defineWithAidIndex = async (faunaClient: Client) => {
  const aidField: keyof VibefireUserT = "aid";
  const q = fql`
    Users.definition.update({
      indexes: {
        withAid: {
          terms: [{ field: ${aidField} }],
        }
      }
    })
  `;
  await dfq(faunaClient, q);
};

export const createUser = async (
  faunaClient: Client,
  userData: VibefireUserNoIdT,
) => {
  const userDataSer = {
    ...userData,
    dateOfBirth:
      userData.dateOfBirth == undefined
        ? undefined
        : DateStub.from(userData.dateOfBirth),
  };
  const q = fql`
    Users.create(${userDataSer}) {
      id
    }
  `;
  return await dfq<{ id: string }>(faunaClient, q);
};

export const updateUserInfo = async (
  faunaClient: Client,
  aid: string,
  userData: Partial<VibefireUserInfoT>,
) => {
  const userDataSer = {
    ...userData,
    dateOfBirth:
      userData.dateOfBirth == undefined
        ? undefined
        : DateStub.from(userData.dateOfBirth),
  };
  const _userDataSer: Partial<typeof userDataSer> = userDataSer;

  const q = fql`
    Users.withAid(${aid}).update(${_userDataSer}) {
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
