import { DateTime } from "luxon";

import {
  EventTypeModel,
  ModelEventUpdate,
  ModelEventUpdateT,
  TEventType,
  TVibefireEvent,
  TVibefireGroup,
  VibefireEventModel,
  VibefireUserInfoT,
} from "@vibefire/models";
import {
  TEventsRepository,
  TGroupsRepository,
  TUsersRepository,
} from "@vibefire/services/fauna";
import { tbValidatorResult, trimAndCropText } from "@vibefire/utils";

import { ManagerRuleError } from "!managers/errors";
import { asyncWrapReturn, unwrapNullablePromise } from "!managers/utils";

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

  private getGroup(groupId: string): Promise<TVibefireGroup> {
    return unwrapNullablePromise(
      this.groupsRepo.getById(groupId).result,
      "This group does not exist",
    );
  }

  private getUserProfile(userAid: string) {
    return unwrapNullablePromise(
      this.usersRepo.getUserProfile(userAid).result,
      "Your profile does not exist",
    );
  }

  private getEvent(eventId: string): Promise<TVibefireEvent> {
    return unwrapNullablePromise(
      this.eventsRepo.getById(eventId).result,
      "This event does not exist",
    );
  }

  private checkUserGroupManager(group: TVibefireGroup, userAid: string) {
    if (group.ownerAid !== userAid && !group.managerAids.includes(userAid)) {
      throw new ManagerRuleError("You do not manage this group");
    }
  }

  private checkUserEventOwner(event: TVibefireEvent, userAid: string) {
    if (event.ownerId !== userAid) {
      throw new ManagerRuleError("You do not manage this group");
    }
  }

  private async checkHasReachedDraftLimit(userAid: string, groupId?: string) {
    const drafts = groupId
      ? // -1 is draft
        await this.eventsRepo.allByStateFor(groupId, -1, "group").result
      : await this.eventsRepo.allByStateFor(userAid, -1, "user").result;
    if (drafts.length >= 5) {
      throw new ManagerRuleError(
        groupId
          ? "Your group has too many draft events"
          : "You have too many draft events",
      );
    }
  }

  newEvent(p: {
    userAid: string;
    forGroupId?: string;
    title: string;
    type: TEventType["type"];
    private: boolean;
  }) {
    return asyncWrapReturn(async () => {
      const eventTypes = EventTypeModel.anyOf.map(
        (e) => e.properties.type.const,
      );
      if (!eventTypes.includes(p.type)) {
        throw new ManagerRuleError("You cannot create this event type");
      }

      // non-group event
      if (p.forGroupId === undefined && !p.private) {
        throw new ManagerRuleError(
          "You cannot create public events as an individual",
        );
      }

      const group = p.forGroupId ? await this.getGroup(p.forGroupId) : null;
      if (group) {
        if (group.group.type === "private" && !p.private) {
          throw new ManagerRuleError(
            "This group is private and cannot make public events",
          );
        }
        this.checkUserGroupManager(group, p.userAid);
      }

      this.checkHasReachedDraftLimit(p.userAid, p.forGroupId);

      const title = tbValidatorResult(VibefireEventModel.properties.title)(
        trimAndCropText(p.title, 100),
      )
        .map(
          (value) => value,
          (err) => new ManagerRuleError(err.message),
        )
        .unwrap();

      const userProfile = await this.getUserProfile(p.userAid);

      const ownerName = group?.name ?? userProfile.name;

      const eventId = await this.eventsRepo.create(
        p.type,
        p.private,
        p.forGroupId ?? p.userAid,
        ownerName,
        p.forGroupId ? "group" : "user",
        title,
        DateTime.utc().toMillis(),
      ).result;

      return eventId;
    });
  }

  async newEventFromPrevious(p: {
    userAid: string;
    forGroupId?: string;
    previousEventId: string;
  }) {
    return asyncWrapReturn(async () => {
      const viewEventRes = await this.viewEvent({
        userAid: p.userAid,
        eventId: p.previousEventId,
        scope: "manage",
      });
      if (!viewEventRes.ok) {
        return viewEventRes;
      }
      this.checkHasReachedDraftLimit(p.userAid, p.forGroupId);

      const e = viewEventRes.value;

      // be pretty unlikey this happens
      if (p.forGroupId && e.ownerId !== p.forGroupId) {
        throw new ManagerRuleError("This event is not part of this group");
      }

      const eNewId = await this.eventsRepo.create(
        e.event.type,
        e.event.public,
        e.ownerId,
        e.ownerName,
        e.ownerType,
        e.title,
        DateTime.utc().toMillis(),
      ).result;

      const eNew = await this.getEvent(eNewId);

      // copy over the rest of the event
      eNew.times = e.times;
      eNew.location = e.location;
      eNew.images = e.images;
      eNew.event = e.event;

      // update the new event
      const updateEventRes = await this.updateEvent({
        userAid: p.userAid,
        eventId: eNewId,
        update: eNew,
      });
      if (!updateEventRes.ok) {
        return updateEventRes;
      }

      return eNew;
    });
  }

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
  }) {
    return asyncWrapReturn(async () => {
      if (p.scope === "manage" && !p.userAid) {
        throw new ManagerRuleError("You must be signed in to view this");
      }

      const e = await this.getEvent(p.eventId);

      if (p.scope == "manage") {
        if (e.ownerType == "group") {
          const g = await this.getGroup(e.ownerId);
          this.checkUserGroupManager(g, p.userAid!);
        } else {
          this.checkUserEventOwner(e, p.userAid!);
        }
      } else if (p.scope == "published") {
        if (e.state !== 1) {
          throw new ManagerRuleError("This event is not published");
        }
        if (e.event.public === false && !e.event.canView.includes(p.userAid!)) {
          throw new ManagerRuleError("This event is private");
        }
        // published and (public or private and can view)
      } else {
        throw new ManagerRuleError("Invalid scope");
      }

      return e as TVibefireEvent;
    });
  }

  async updateEvent(p: {
    userAid: string;
    eventId: string;
    update: Partial<ModelEventUpdateT>;
  }) {
    return asyncWrapReturn(async () => {
      const e = await this.getEvent(p.eventId);
      this.checkUserEventOwner(e, p.userAid);

      const update = tbValidatorResult(ModelEventUpdate)(p.update)
        .map(
          (value) => value,
          (err) => new ManagerRuleError(err.message),
        )
        .unwrap();

      await this.eventsRepo.update(p.eventId, update).result;
    });
  }

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
