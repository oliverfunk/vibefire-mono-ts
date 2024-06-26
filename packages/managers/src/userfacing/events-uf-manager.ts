import { DateTime } from "luxon";

import {
  EventTypeModel,
  TEventType,
  TEventUpdate,
  TVibefireEvent,
  VibefireEventModel,
} from "@vibefire/models";
import {
  TEventsRepository,
  TGroupsRepository,
  TUsersRepository,
} from "@vibefire/services/fauna";
import {
  asyncResultReturn,
  filterNoneResult,
  Result,
  resultChain,
  resultChainAsync,
  tbValidator,
  tbValidatorResult,
  trimAndCropText,
} from "@vibefire/utils";

export class EventsUFManger {
  constructor(
    private readonly eventsRepo: TEventsRepository,
    private readonly usersRepo: TUsersRepository,
    private readonly groupsRepo: TGroupsRepository,
  ) {}

  // async eventCreate(
  //   userAc: ClerkSignedInAuthContext,
  //   title: VibefireEventT["title"],
  //   organisationId?: string,
  // ) {
  //   checkUserIsPartOfOrg(userAc, organisationId);
  //   const organiserId = organisationId || userAc.userId;

  //   // check if the user is spamming create events
  //   // max 5 in draft, max 10 in draft or ready
  //   const organiserEvents = await getEventsByOrganiser(
  //     this.faunaClient,
  //     organiserId,
  //   );

  //   const draftEvents = organiserEvents.filter((e) => e.state === "draft");

  //   if (draftEvents.length >= 5) {
  //     throw new Error("Too many draft events");
  //   }

  //   const e = Value.Create(VibefireEventSchema);
  //   e.organiserId = organisationId || userAc.userId;

  //   title = tbValidator(VibefireEventSchema.properties.title)(
  //     trimAndCropText(title, 100),
  //   );
  //   e.title = title;

  //   if (organisationId === undefined) {
  //     // if the user is not part of an organisation, then they are creating
  //     // a user event, so set the type to user
  //     e.organiserType = "user";
  //     e.visibility = "link-only"; // by default
  //     const userInfo = await this.getUserInfo(userAc);
  //     e.organiserName = userInfo.name;
  //   } else {
  //     e.organiserType = "group";
  //     e.visibility = "public"; // by default
  //   }

  //   e.type = "one-time"; // by default
  //   e.linkId = crypto.randomUUID().slice(-9);
  //   e.dateCreatedUTC = nowAtUTC().toISO()!;
  //   e.dateUpdatedUTC = nowAtUTC().toISO()!;

  //   removeUndef(e);

  //   const res = await createEvent(this.faunaClient, e);

  //   return res;
  // }

  // async eventCreateFromPrevious(
  //   userAc: ClerkSignedInAuthContext,
  //   eventId: string,
  //   organisationId?: string,
  // ) {
  //   checkUserIsPartOfOrg(userAc, organisationId);
  //   const organiserId = organisationId || userAc.userId;

  //   const e = await getEventFromIDByOrganiser(
  //     this.faunaClient,
  //     eventId,
  //     organiserId,
  //   );
  //   if (!e) {
  //     throw new Error("Event not found");
  //   }

  //   const newEvent = Value.Create(
  //     VibefireEventSchema,
  //   ) as PartialDeep<VibefireEventT>;

  //   newEvent.state = "draft";
  //   newEvent.published = false;
  //   newEvent.dateCreatedUTC = nowAtUTC().toISO()!;
  //   newEvent.dateUpdatedUTC = nowAtUTC().toISO()!;

  //   newEvent.organiserId = e.organiserId!;
  //   newEvent.organiserType = e.organiserType!;
  //   newEvent.organiserName = e.organiserName!;
  //   newEvent.visibility = e.visibility!;
  //   newEvent.type = e.type!;
  //   newEvent.linkId = crypto.randomUUID().slice(-9);
  //   newEvent.title = e.title!;

  //   newEvent.description = e.description;
  //   newEvent.tags = e.tags;
  //   newEvent.location = e.location;
  //   newEvent.timeZone = e.timeZone;
  //   newEvent.images = e.images;

  //   removeUndef(newEvent);

  //   const res = await createEvent(this.faunaClient, newEvent);
  //   return res;
  // }

  private async isUserGroupManager(
    userAid: string,
    groupId?: string,
  ): Promise<Result<boolean | null, Error>> {
    if (!groupId) {
      return Result.justOk();
    }
    return (await this.groupsRepo.getGroup(groupId).result).chain((group) => {
      if (!group) {
        return Result.err(new Error("This group does not exist"));
      }
      if (group.ownerAid === userAid || group.managerAids.includes(userAid)) {
        return Result.ok(true);
      }
      return Result.err(new Error("You do not manage this group"));
    });
  }

  private async hasReachedDraftLimit(userAid: string, groupId?: string) {
    return (
      groupId
        ? // -1 is draft
          await this.eventsRepo.allByStateFor(groupId, -1, "group").result
        : await this.eventsRepo.allByStateFor(userAid, -1, "user").result
    ).chain((drafts) => {
      if (drafts.length >= 5) {
        return groupId
          ? Result.err(new Error("Your group has too many draft events"))
          : Result.err(new Error("You have too many draft events"));
      }
      return Result.ok(false);
    });
  }

  newEvent(p: {
    userAid: string;
    forGroupId?: string;
    title: string;
    type: TEventType["type"];
  }) {
    return asyncResultReturn(
      Result.fromResult(() => {
        const eventTypes = EventTypeModel.anyOf.map(
          (e) => e.properties.type.const,
        );
        if (eventTypes.includes(p.type)) {
          return Result.ok(true);
        }
        return Result.err(new Error("Invalid event type"));
      })
        .chainAsync((_) => {
          return this.isUserGroupManager(p.userAid, p.forGroupId);
        })
        // check if the user is spamming create events
        // max 5 in draft
        .then(
          resultChainAsync((_) => {
            return this.hasReachedDraftLimit(p.userAid, p.forGroupId);
          }),
        )
        .then(
          resultChainAsync((_) => {
            return this.usersRepo.getUserProfile(p.userAid).result;
          }),
        )
        .then(
          resultChain((userProfile) =>
            filterNoneResult(userProfile, "Your profile does not exist"),
          ),
        )
        .then(
          resultChain((userProfile) =>
            tbValidatorResult(VibefireEventModel.properties.title)(
              trimAndCropText(p.title, 100),
            ).map((title) => ({ title, userProfile })),
          ),
        )
        .then(
          resultChainAsync(async ({ title, userProfile }) => {
            return this.eventsRepo.create(
              p.userAid,
              userProfile.name,
              "user",
              title,
              DateTime.utc().toMillis(),
            ).result;
          }),
        ),
    );
  }

  // async createFromPrevious(p: {
  //   userAid: string;
  //   forGroupId?: string;
  //   previousEventId?: string;
  // }): Promise<string> {}

  async eventsByUser(p: { userAid: string }) {}
  async eventsByGroup(p: {
    userAid?: string;
    groupId: string;
    scope: "all" | "published";
  }) {}

  async eventsPartOf(p: {
    userAid?: string;
    planId: string;
    scope: "all" | "published";
  }) {}

  async viewEvent(p: {
    userAid?: string;
    eventId: string;
    scope: "manage" | "published";
  }) {}

  async updateEvent(p: {
    userAid: string;
    eventId: string;
    updated: Partial<TEventUpdate>;
  }) {}

  async updateEventVisibility(p: {
    userAid: string;
    eventId: string;
    update: "hidden" | "published";
  }) {}

  async updateEventLinkId(p: {
    userAid: string;
    eventId: string;
    update: "remove" | "regenerate";
  }) {}

  async updateEventPartOf(p: {
    userAid: string;
    eventId: string;
    update: "remove" | "set";
    planId?: string;
  }) {}

  async deleteEvent(p: { userAid: string; eventId: string }) {}
}
