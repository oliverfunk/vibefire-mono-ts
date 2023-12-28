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

export const getUserByAid = async (faunaClient: Client, aid: string) => {
  const q = fql`
    Users.withAid(${aid}).first()
  `;
  return await dfq<VibefireUserT | null>(faunaClient, q);
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
    Users.withAid(${aid}).first().update(${_userDataSer}) {
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

export const starEvent = async (
  faunaClient: Client,
  aid: string,
  eventId: string,
) => {
  const _followedEventsField: keyof VibefireUserT = "followedEvents";
  const q = fql`
    let u = Users.withAid(${aid}).first()
    let updatedFollowedEvents = u?.followedEvents.append(${eventId}).distinct()
    u?.update({ followedEvents: updatedFollowedEvents })
  `;
  return await dfq(faunaClient, q);
};
export const unstarEvent = async (
  faunaClient: Client,
  aid: string,
  eventId: string,
) => {
  const _followedEventsField: keyof VibefireUserT = "followedEvents";
  const q = fql`
    let u = Users.withAid(${aid}).first()
    let updatedFollowedEvents = u?.followedEvents.filter((eventId) => eventId != ${eventId}).distinct()
    u?.update({ followedEvents: updatedFollowedEvents })
  `;
  return await dfq(faunaClient, q);
};

// export const removeFollowedEvent = async (

export const hideEvent = async (
  faunaClient: Client,
  aid: string,
  eventId: string,
) => {
  const _hiddenEventsField: keyof VibefireUserT = "hiddenEvents";
  const q = fql`
    let u = Users.withAid(${aid}).first()
    let updatedHiddenEvents = u?.hiddenEvents.append(${eventId}).distinct()
    // remove from followed events if it's there
    let updatedFollowedEvents = u?.followedEvents.filter((eventId) => eventId != ${eventId}).distinct()
    u?.update({ hiddenEvents: updatedHiddenEvents, followedEvents: updatedFollowedEvents })
  `;
  return await dfq(faunaClient, q);
};

export const blockOrganiser = async (
  faunaClient: Client,
  aid: string,
  organiserId: string,
) => {
  const _blockedOrganisersField: keyof VibefireUserT = "blockedOrganisers";
  const q = fql`
    let u = Users.withAid(${aid}).first()
    let updatedBlockedOrganisers = u?.blockedOrganisers.append(${organiserId}).distinct()
    u?.update({ blockedOrganisers: updatedBlockedOrganisers })
  `;
  return await dfq(faunaClient, q);
};

export const setUserPushToken = async (
  faunaClient: Client,
  aid: string,
  token: string,
) => {
  const _pushTokenField: keyof VibefireUserT = "pushToken";
  const q = fql`
    let u = Users.withAid(${aid}).first()
    u?.update({ pushToken: ${token} })
  `;
  return await dfq(faunaClient, q);
};

export const clearUserPushToken = async (faunaClient: Client, aid: string) => {
  const _pushTokenField: keyof VibefireUserT = "pushToken";
  const q = fql`
    let u = Users.withAid(${aid}).first()
    u?.update({ pushToken: null })
  `;
  return await dfq(faunaClient, q);
};

export const getUserPushToken = async (faunaClient: Client, aid: string) => {
  const _pushTokenField: keyof VibefireUserT = "pushToken";
  const q = fql`
    let u = Users.withAid(${aid}).first()
    u?.pushToken
  `;
  return await dfq<string | null>(faunaClient, q);
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
