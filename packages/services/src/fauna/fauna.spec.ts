import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

import { getFaunaService, type RepositoryService } from ".";

describe("events uf manager", () => {
  let faunaService: RepositoryService;
  let testUserAid: string;

  beforeAll(() => {
    // requires env FAUNA_ROLE_KEY_SECRETE
    faunaService = getFaunaService();
    testUserAid = process.env.TEST_USER_AID!;
  });

  it("run", async () => {
    const r = await faunaService.Event.withIdIfUserCanManage(
      "401880614717882575",
      testUserAid,
    ).result;
    console.log(r);
    expect(r.isOk && r.value).toBeDefined();
  });

  it("run 2", async () => {
    const r = await faunaService.Event.withIdIfUserCanView(
      "401880614717882575",
      testUserAid,
    ).result;
    console.log(r);
  });

  it("run 3", async () => {
    const r = await faunaService.Group.withIdIfUserCanManage(
      "401880614717882575",
      testUserAid,
    ).result;
    console.log(r);
  });

  afterAll(() => {
    faunaService.close();
  });
});
