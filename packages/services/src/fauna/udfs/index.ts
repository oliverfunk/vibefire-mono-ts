import { fql, type Client } from "fauna";

import { type VibefireEventT } from "@vibefire/models";

import { dfq } from "../utils";

export const createUDFPublicEventsInPeriodInAreas = async (
  faunaClient: Client,
) => {
  const q = fql`
    Function.create({
      name: "publicEventsInPeriodInAreas",
      body: <<-END
        (timePeriod, h3s) => {
          h3s.toSet().flatMap(h3 => Events.geoTemporal(timePeriod, h3, 'public', true))
        }
      END
    })
  `;
  return await dfq(faunaClient, q);
};
export const callPublicEventsInPeriodInAreas = async (
  faunaClient: Client,
  timePeriodIndex: string,
  areaH3s: number[],
) => {
  const q = fql`
    publicEventsInPeriodInAreas(
      ${timePeriodIndex}, ${areaH3s}
    )
  `;
  return (await dfq<{ data: VibefireEventT[] }>(faunaClient, q)).data;
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

export const createUDFPublishedEventByIdForExternalUser = async (
  faunaClient: Client,
) => {
  const q = fql`
    Function.create({
      name: "publishedEventByIdForExternalUser",
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
export const callPublishedEventByIdForExternalUser = async (
  faunaClient: Client,
  accessorId: string,
  eventId: string,
) => {
  const q = fql`
    publishedEventByIdForExternalUser(
        ${accessorId}, ${eventId}
      )
  `;
  return await dfq<VibefireEventT>(faunaClient, q);
};

export const createUDUpcomingEventsForUser = async (faunaClient: Client) => {
  const q = fql`
    Function.create({
      name: "upcomingEventsForUser",
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
export const callUpcomingEventsForUser = async (
  faunaClient: Client,
  userId: string,
  queryPeriods: string[],
) => {
  const q = fql`
    upcomingEventsForUser(
      ${userId}, ${queryPeriods}
    )
  `;
  return await dfq<VibefireEventT[]>(faunaClient, q);
};
