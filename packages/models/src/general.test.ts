import { jest } from "@jest/globals";
import { Static, Type as t } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const a = t.Number({ minimum: 1, default: 10 });

console.log("helelleleo");

test("adds 1 + 2 to equal 3", () => {
  console.log("CoordSchema");
});
