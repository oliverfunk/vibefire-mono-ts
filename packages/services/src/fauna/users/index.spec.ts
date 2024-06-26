import { describe, expect, test } from "@jest/globals";

import { getFaunaService } from "..";

describe("users", () => {
  it("should get the user profile", async () => {
    const { Users, _client } = getFaunaService(
      "fnAFkmHtYQAAz82IIGT9ZJm0S7sAIi4fAxgFMybM",
    );
    const r = await Users.getUserProfile("user_2YBCzOespzKi3jsIIRtJyQsAAoX")
      .result;
    expect(r.unwrap()).toBeDefined();
    _client.close();
  });
});
