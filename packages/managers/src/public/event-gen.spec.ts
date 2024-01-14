import { setManagersContext } from "../managers-context";
import { getFaunaUserManager } from "./fauna-user-manager";

setManagersContext({
  faunaClientKey: "***REMOVED***",
});

test("getFaunaUserManager", () => {
  expect(getFaunaUserManager()).toBeDefined();
});
