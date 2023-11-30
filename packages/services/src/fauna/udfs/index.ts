import { fql, type Client } from "fauna";

import { type VibefireEventT } from "@vibefire/models";

import { dfq } from "../utils";

export const createUDFEventsInAreasDuringPeriodForUser = async (
  faunaClient: Client,
) => {
  const q = fql`
    Function.create({
      name: "eventsInAreasDuringPeriodForUser",
      body: <<-END
        (userId, timePeriod, h3s) => {
          let events = h3s.toSet().flatMap(h3 => Events.geoTemporal(timePeriod, h3, true)).toArray()
          events.filter((event) => filterEventIsPublishedAndViewable(userId, event.id, event))
        }
      END
    })
  `;
  return await dfq(faunaClient, q);
};
export const callEventsInAreasDuringPeriodForUser = async (
  faunaClient: Client,
  userId: string,
  timePeriod: string,
  h3s: number[],
) => {
  console.log(JSON.stringify(userId, null, 2));
  console.log(JSON.stringify(timePeriod, null, 2));
  console.log(JSON.stringify(h3s, null, 2));
  const q = fql`
    let events = ${h3s}.toSet().flatMap(h3 => Events.geoTemporal(${timePeriod}, h3, true)).toArray()
    events.filter((event) => filterEventIsPublishedAndViewable(${userId}, event.id, event))
  `;
  return await dfq<VibefireEventT[]>(faunaClient, q);
};
export const callEventsInBBoxDuringPeriodForUser = async (
  faunaClient: Client,
  userId: string,
  timePeriod: string,
  northWest: { lat: number; lng: number },
  southEast: { lat: number; lng: number },
) => {
  console.log(JSON.stringify(userId, null, 2));
  console.log(JSON.stringify(timePeriod, null, 2));
  console.log(JSON.stringify(northWest, null, 2));
  console.log(JSON.stringify(southEast, null, 2));
  const q = fql`
    let events = Events.betweenLatLng(
      ${timePeriod}, true, {
        from: [${southEast.lat}, ${southEast.lng}],
        to: [${northWest.lat}, ${northWest.lng}],
      }
    ).toArray()
    events.filter((event) => filterEventIsPublishedAndViewable(${userId}, event.id, event))
  `;
  return await dfq<VibefireEventT[]>(faunaClient, q);
};

export const createUDFFilterEventIsPublishedAndViewable = async (
  faunaClient: Client,
) => {
  const q = fql`
    Function.create({
      name: "filterEventIsPublishedAndViewable",
      body: <<-END
      (accessorId, eventId, event)=> {
          // I hate the nesting too...
          if (event.published == false) {
            false
          } else {
            if (event.visibility == "invite-only") {
              if (accessorId == "anon") {
                false
              } else {
                if (event.organiserId == accessorId){
                  true
                } else {
                  let eventManagement = EventsManagement.fromEventId(eventId).first()!
                  if (eventManagement.invited.includes(accessorId)) {
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

export const createUDFEventPublishedByIdForExternalUser = async (
  faunaClient: Client,
) => {
  const q = fql`
    Function.create({
      name: "eventPublishedByIdForExternalUser",
      body: <<-END
      (accessorId, eventId) => {
        let event = Events.byId(eventId)
        if(event.exists() && filterEventIsPublishedAndViewable(accessorId, eventId, event!)){
          event
        }else{
          null
        }
      }
      END
    })
  `;
  return await dfq(faunaClient, q);
};
export const callEventPublishedByIdForExternalUser = async (
  faunaClient: Client,
  accessorId: string,
  eventId: string,
) => {
  const q = fql`
      eventPublishedByIdForExternalUser(
        ${accessorId}, ${eventId}
      )
  `;
  return await dfq<VibefireEventT>(faunaClient, q);
};

export const createUDFEventsUpcomingForUser = async (faunaClient: Client) => {
  const q = fql`
    Function.create({
      name: "eventsUpcomingForUser",
      body: <<-END
        (userId, queryPeriods) => {
          let maxFollowed = 20
          let followedEvents = Users.withAid(userId).first()!.followedEvents.toSet().order(desc((_v) => _v)).take(maxFollowed).map((eventId) => Events.byId(eventId))
          let organisedEvents = Events.byOrganiserID(userId)
          let upcomingEvents = followedEvents.concat(organisedEvents).where(.displayTimePeriods.any((dtp) => queryPeriods.includes(dtp)))
          upcomingEvents.toArray().filter((event) => filterEventIsPublishedAndViewable(userId, event.id, event))
        }
      END
    })
  `;
  return await dfq(faunaClient, q);
};
export const callEventsUpcomingForUser = async (
  faunaClient: Client,
  userId: string,
  queryPeriods: string[],
) => {
  const q = fql`
    eventsUpcomingForUser(
      ${userId}, ${queryPeriods}
    )
  `;
  return await dfq<VibefireEventT[]>(faunaClient, q);
};
