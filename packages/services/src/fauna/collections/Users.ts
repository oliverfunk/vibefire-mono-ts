import { Client, DateStub, Document, fql } from "fauna";

import {
  VibefireUserInfoT,
  VibefireUserNoIdT,
  VibefireUserT,
} from "@vibefire/models";

import { CreateCollectionIfDne, dfq } from "../utils";

export const createUsersCollection = (faunaClient: Client) =>
  dfq(faunaClient, CreateCollectionIfDne("Users"));

export const createUsersUniqueConstraints = (faunaClient: Client) => {
  const aidField: keyof VibefireUserT = "aid";
  const q = fql`
    Users.definition.update({
      constraints: [
        { unique: [ ${aidField} ] }
      ]
    })
  `;
  return dfq(faunaClient, q);
};

export const createWithAidIndex = (faunaClient: Client) => {
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
  return dfq(faunaClient, q);
};

export const createUser = (
  faunaClient: Client,
  userData: VibefireUserNoIdT,
) => {
  const userDataSer = {
    ...userData,
    dateOfBirth:
      userData.dateOfBirth == undefined
        ? undefined
        : DateStub.fromDate(userData.dateOfBirth),
  };
  const q = fql`
    Users.create(${userDataSer}) {
      id
    }
  `;
  return dfq<{ id: string }>(faunaClient, q);
};

export const updateUserInfo = (
  faunaClient: Client,
  aid: string,
  userData: Partial<VibefireUserInfoT>,
) => {
  const userDataSer = {
    ...userData,
    dateOfBirth:
      userData.dateOfBirth == undefined
        ? undefined
        : DateStub.fromDate(userData.dateOfBirth),
  };

  const q = fql`
    Users.withAid(${aid}).update(${userDataSer}) {
      id
    }
  `;
  return dfq<{ id: string }>(faunaClient, q);
};

export const deleteUser = (faunaClient: Client, aid: string) => {
  const q = fql`
    Users.withAid(${aid}).delete()
  `;
  return dfq<{ id: string }>(faunaClient, q);
};

export const addFollowedEvent = (
  faunaClient: Client,
  aid: string,
  eventId: string,
) => {
  const q = fql`
    let u = Users.withAid(${aid})
    let updatedFollowedEvents = u?.followedEvents.append([${eventId}]).distinct()
    u?.update({ followedEvents: updatedFollowedEvents })
  `;
  return dfq(faunaClient, q);
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
