import { describe, expect, test } from "@jest/globals";

import { getFaunaService } from "@vibefire/services/fauna";

import { EventsUFManger } from "./events-uf-manager";

describe("events uf manager", () => {
  let FaunaService: ReturnType<typeof getFaunaService>;
  let eventsManager: EventsUFManger;
  let testUserAid: string;

  beforeAll(() => {
    FaunaService = getFaunaService(); // requires env FAUNA_ROLE_KEY_SECRETE
    const { Users, Events, Groups } = FaunaService;
    eventsManager = new EventsUFManger(Events, Users, Groups);
    testUserAid = process.env.TEST_USER_AID!;
  });

  describe("creating new private events", () => {
    it("should create an event", async () => {
      const r = await eventsManager.newEvent({
        userAid: testUserAid,
        title: "test title",
        type: "event",
        private: true,
      });
      expect(r.ok).toBe(true);
    });

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

    it("should fail because the event type is invalid", async () => {
      const r = await eventsManager.newEvent({
        userAid: testUserAid,
        title: "test title",
        type: "not-a-type" as any,
        private: true,
      });
      expect(r.ok).toBe(false);
    });
  });

  afterAll(() => {
    FaunaService.close();
  });
});
