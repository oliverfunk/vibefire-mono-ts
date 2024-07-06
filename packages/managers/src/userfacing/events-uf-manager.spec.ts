import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

import { getFaunaService } from "@vibefire/services/fauna";

import { ManagerRuleViolation } from "!managers/errors";

import { EventsUFManger } from "./events-uf-manager";

describe("events uf manager", () => {
  let FaunaService: ReturnType<typeof getFaunaService>;
  let eventsManager: EventsUFManger;
  let testUserAid: string;

  beforeAll(() => {
    // requires env FAUNA_ROLE_KEY_SECRETE
    FaunaService = getFaunaService();
    const { Users, Events, Groups, Plans } = FaunaService;
    eventsManager = new EventsUFManger(Events, Users, Groups, Plans);
    testUserAid = process.env.TEST_USER_AID!;
  });

  // it("should create an event", async () => {
  //   const r = await eventsManager.newEvent({
  //     userAid: testUserAid,
  //     title: "test title",
  //     type: "event",
  //     private: true,
  //   });
  //   expect(r.ok).toBe(true);
  // });

  // it("should create an event, with a trimmed title", async () => {
  //   const r = await eventsManager.newEvent({
  //     userAid: testUserAid,
  //     title:
  //       "this is an extremely long title that should not be allowed to be created because it is too long and should be trimmed",
  //     type: "event-private",
  //   });
  //   expect(r.ok).toBe(true);
  //   // for type narrowing
  //   if (!r.ok) {
  //     return;
  //   }

  //   const rr = await eventsManager.viewEvent({
  //     userAid: testUserAid,
  //     eventId: r.value,
  //     scope: "manage",
  //   });
  //   expect(rr.ok).toBe(true);
  // });

  // it("should fail because the event type is invalid", async () => {
  //   const r = await eventsManager.newEvent({
  //     userAid: testUserAid,
  //     title: "test title",
  //     type: "not-a-type" as any,
  //     private: true,
  //   });
  //   expect(r.ok).toBe(false);
  // });
  describe("updating events", () => {
    it("should update an event", async () => {
      const eventId = "401741200389832910";
      const res = await eventsManager.updateEvent({
        userAid: testUserAid,
        eventId: eventId,
        update: {
          title: "updated title",
          images: {
            bannerImgKeys: ["test", "test-another"],
          },
          event: {
            type: "event",
            public: true,
            details: [
              {
                type: "description",
                description: "test description 2",
                v: 1,
                nOrder: 1,
              },
            ],
          },
        },
      });
      expect(res.isOk).toBe(true);
    });

    it("should fail to update an event", async () => {
      const eventId = "401741200389832910";
      const res = await eventsManager.updateEvent({
        userAid: testUserAid,
        eventId: eventId,
        update: {
          title: 1123 as never,
          images: {
            bannerImgKeys: ["test", 123] as never,
          },
        },
      });
      expect(res.isErr).toBe(true);
      if (res.isErr) {
        expect(res.error).toBeInstanceOf(ManagerRuleViolation);
      }
    });
  });

  describe("viewing private events", () => {
    it("should return the events owned by the user, in the future it should also return those managed by the user, and the plans", async () => {
      const res = await eventsManager.eventsByUser({
        userAid: testUserAid,
      });

      // expect(res.isOk).toBe(true);
      // if (res instanceof ManagerValue) {
      //   expect(res.value.data.length).toBe(10);
      //   if (res.value.afterKey) {
      //     const pageRtn = await eventsManager.pageEvents({
      //       pageHash: res.value.afterKey,
      //     });
      //     expect(pageRtn).toBeInstanceOf(ManagerValue);
      //     expect(pageRtn.ok).toBe(true);
      //     if (pageRtn.ok) {
      //       expect(pageRtn.value.data.length).toBeLessThanOrEqual(10);
      //     }
      //   }
      // }
    });
  });

  afterAll(() => {
    FaunaService.close();
  });
});
