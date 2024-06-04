import { fql, type Client } from "fauna";

import { type VibefireEventT } from "@vibefire/models";

import { dfq } from "../utils";

// export const createUDFEventsInAreasDuringPeriodForUser = async (
//   faunaClient: Client,
// ) => {
//   const q = fql`
//     Function.create({
//       name: "eventsInAreasDuringPeriodForUser",
//       body: <<-END
//         (userId, timePeriod, h3s) => {
//           let events = h3s.toSet().flatMap(h3 => Events.geoTemporal(timePeriod, h3, true)).toArray()
//           events.filter((event) => filterEventIsPublishedAndViewable(userId, event.id, event))
//         }
//       END
//     })
//   `;
//   return await dfq(faunaClient, q);
// };
// export const callEventsInAreasDuringPeriodForUser = async (
//   faunaClient: Client,
//   userAid: string,
//   timePeriod: string,
//   h3s: number[],
// ) => {
//   const q = fql`

//   `;
//   return await dfq<VibefireEventT[]>(faunaClient, q);
// };

export const callEventsInBBoxDuringPeriodForUser = async (
  faunaClient: Client,
  userAidOrAnon: string,
  timePeriod: string,
  northWest: { lat: number; lng: number },
  southEast: { lat: number; lng: number },
) => {
  const _fvLinkOnly: VibefireEventT["visibility"] = "link-only";
  const q = fql`
    // these can only be shown if user has starred them
    let filterOutLinkOnly = (userProfile, eventId, event) => {
      if (event.visibility == "link-only") {
        false
      } else {
        true
      }
    }
    let user = Users.withAid(${userAidOrAnon}).first() ?? {aid: "anon"}
    let events = Events.betweenLatLng(
      ${timePeriod}, true, {
        from: [${southEast.lat}, ${southEast.lng}],
        to: [${northWest.lat}, ${northWest.lng}],
      }
    ).toArray()
    events.filter((event) => filterEventIsPublishedAndViewable(user, event.id, event))
          .filter((event) => filterOutLinkOnly(user, event.id, event))
  `;
  return await dfq<VibefireEventT[]>(faunaClient, q);
};

export const createUDFFilterEventIsPublishedAndViewable = async (
  faunaClient: Client,
) => {
  // todo: refactor filter into individual functions
  // todo: refactor the event schema to include event management PK-FK
  // remove that field before sending to the client
  // means you don't need to fetch maanagement per event, in the filter
  // will be a lot faster
  const _fvInviteOnly: VibefireEventT["visibility"] = "invite-only";
  const q = fql`
    Function.byName("filterEventIsPublishedAndViewable")!.delete()
    Function.create({
      name: "filterEventIsPublishedAndViewable",
      body: <<-END
        (userProfile, eventId, event) => {
          // I hate the nesting too...
          if (event.state != "ready" || event.published == false) {
            false
          } else {
            if (event.visibility == "invite-only") {
              if (userProfile.aid == "anon") {
                false
              } else {
                if (event.organiserId == userProfile.aid){
                  true
                } else {
                  let eventManagement = EventsManagement.fromEventId(eventId).first()!
                  if (eventManagement.invited.includes(userProfile.aid)) {
                    true
                  } else {
                    false
                  }
                }
              }
            } else {
              true
            }
          }
        }
      END
    })
  `;
  return await dfq(faunaClient, q);
};

// export const createUDFEventPublishedByIdForExternalUser = async (
//   faunaClient: Client,
// ) => {
//   const q = fql`
//     Function.create({
//       name: "eventPublishedByIdForExternalUser",
//       body: <<-END
//       (userAid, eventId) => {
//         let user = Users.withAid(userAid).first() ?? {aid: "anon"}
//         let event = Events.byId(eventId)
//         if(event.exists() && filterEventIsPublishedAndViewable(user, eventId, event!)){
//           event
//         }else{
//           null
//         }
//       }
//       END
//     })
//   `;
//   return await dfq(faunaClient, q);
// };
export const callEventPublishedByLinkIdForExternalUser = async (
  faunaClient: Client,
  userAidOrAnon: string,
  linkId: string,
) => {
  const q = fql`
    let userAidOrAnon = ${userAidOrAnon}
    let linkId = ${linkId}

    let user = Users.withAid(userAidOrAnon).first() ?? {aid: "anon"}
    let event = Events.byLinkID(linkId).first()!
    if(event.exists() && filterEventIsPublishedAndViewable(user, event!.id, event!)){
      event
    }else{
      null
    }
  `;
  return await dfq<VibefireEventT>(faunaClient, q);
};

export const createUDFEventsStarredOwnedDuringPeriods = async (
  faunaClient: Client,
) => {
  // todo: rename this fauna side
  const q = fql`
    Function.create({
      name: "eventsUpcomingForUser",
      body: <<-END
        (userAid, queryPeriods) => {
          let maxFollowed = 20
          let user = Users.withAid(userAid).first()!
          let followedEvents = Users.withAid(userAid).first()!.followedEvents.toSet().order(desc((_v) => _v)).take(maxFollowed).map((eventId) => Events.byId(eventId))
          let organisedEvents = Events.byOrganiserID(userAid)
          let upcomingEvents = followedEvents.concat(organisedEvents).where(.displayTimePeriods.any((dtp) => queryPeriods.includes(dtp))).toArray()
          upcomingEvents.filter((event) => filterEventIsPublishedAndViewable(user, event.id, event))
        }
      END
    })
  `;
  return await dfq(faunaClient, q);
};
export const callAuthedEventsStarredOwnedDuringPeriods = async (
  faunaClient: Client,
  userAid: string,
  queryPeriods: string[],
) => {
  const q = fql`
    let userAid = ${userAid}
    let queryPeriods = ${queryPeriods}

    let maxFollowed = 20
    let user = Users.withAid(userAid).first()!
    let followedEvents = Users.withAid(userAid).first()!.followedEvents.toSet().order(desc((_v) => _v)).take(maxFollowed).map((eventId) => Events.byId(eventId))
    let organisedEvents = Events.byOrganiserID(userAid)
    let upcomingEvents = followedEvents.concat(organisedEvents).where(.displayTimePeriods.any((dtp) => queryPeriods.includes(dtp))).toArray()
    upcomingEvents.filter((event) => filterEventIsPublishedAndViewable(user, event.id, event))
  `;
  return await dfq<VibefireEventT[]>(faunaClient, q);
};
