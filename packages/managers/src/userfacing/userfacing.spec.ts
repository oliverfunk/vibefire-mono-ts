import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

import { type Result } from "@vibefire/models";
import {
  getFaunaService,
  type RepositoryService,
} from "@vibefire/services/fauna";
import { resourceLocator } from "@vibefire/utils";

import { ManagerRuleViolation } from "!managers/errors";

import { getUFEventsManager, type UFEventsManger } from "./uf-events-manager";

const env = process.env;

const expectResToBeOk = <T>(res: Result<T, Error>) => {
  if (res.isErr) {
    console.error(res.error);
  }
  expect(res.isOk).toBe(true);
};

const expectResToBeErr = <T>(res: Result<T, Error>) => {
  if (res.isOk) {
    console.error("expect err, got value:", JSON.stringify(res.value));
  }
  expect(res.isErr).toBe(true);
};

describe("events uf manager", () => {
  let faunaService: RepositoryService;
  let eventsManager: UFEventsManger;
  let testUserAid: string;

  beforeAll(() => {
    // requires env FAUNA_ROLE_KEY_SECRETE
    resourceLocator().setCtx({
      fauna: {
        roleKey: env.FAUNA_ROLE_KEY!,
      },
      cloudFlare: {
        accountId: env.CF_ACCOUNT_ID!,
        imagesApiKey: env.CF_IMAGES_API_KEY!,
      },
    });
    eventsManager = getUFEventsManager();
    testUserAid = env.TEST_USER_AID!;
  });

  it("should create an event", async () => {
    const r = await eventsManager.createNewEvent({
      userAid: testUserAid,
      name: "test title",
      accessType: "open",
    });
    expectResToBeOk(r);
  });

  // it("should create an event, with a trimmed title", async () => {
  //   const newEventRes = await eventsManager.createNewEvent({
  //     userAid: testUserAid,
  //     name: "this is an extremely long title that should not be allowed to be created because it is too long and should be trimmed",
  //     accessType: "open",
  //   });
  //   expectResToBeOk(newEventRes);
  //   if (newEventRes.isOk) {
  //     const viewEventRes = await eventsManager.viewEvent({
  //       userAid: testUserAid,
  //       eventId: newEventRes.value,
  //       scope: "manage",
  //     });
  //     expectResToBeOk(viewEventRes);
  //   }
  // });

  // describe("updating events", () => {
  //   it("should update an event", async () => {
  //     const eventId = "401741200389832910";
  //     const res = await eventsManager.updateEvent({
  //       userAid: testUserAid,
  //       eventId: eventId,
  //       update: {
  //         name: "updated title",
  //         images: {
  //           bannerImgKeys: ["test", "test-another"],
  //         },
  //         details: [
  //           {
  //             type: "description",
  //             description: "test description 2",
  //             blockTitle: "test block title 2",
  //           },
  //         ],
  //       },
  //     });
  //     expectResToBeOk(res);
  //   });

  //   it("should fail to update an event", async () => {
  //     const eventId = "401741200389832910";
  //     const res = await eventsManager.updateEvent({
  //       userAid: testUserAid,
  //       eventId: eventId,
  //       update: {
  //         name: 1123 as never,
  //         images: {
  //           bannerImgKeys: ["test", 123] as never,
  //         },
  //       },
  //     });
  //     expectResToBeErr(res);
  //     if (res.isErr) {
  //       expect(res.error).toBeInstanceOf(ManagerRuleViolation);
  //     }
  //   });
  // });

  // describe("viewing private events", () => {
  //   it("should return the events owned by the user, in the future it should also return those managed by the user, and the plans", async () => {
  //     const res = await eventsManager.eventsUserIsApart({
  //       userAid: testUserAid,
  //     });
  //     expectResToBeOk(res);
  //     if (res.isOk) {
  //       expect(res.value.data.length).toBe(10);
  //       if (res.value.afterKey) {
  //         const pageRes = await eventsManager.pageEvents({
  //           pageHash: res.value.afterKey,
  //         });
  //         expectResToBeOk(pageRes);
  //         if (pageRes.isOk) {
  //           expect(pageRes.value.data.length).toBeLessThanOrEqual(10);
  //         }
  //       }
  //     }
  //   });
  // });

  afterAll(() => {
    getFaunaService().close();
  });
});
