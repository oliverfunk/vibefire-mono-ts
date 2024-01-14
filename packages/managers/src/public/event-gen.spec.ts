import { setManagersContext } from "../managers-context";
import { getFaunaUserManager } from "./fauna-user-manager";

setManagersContext({
  faunaClientKey: "fnAFMx9AKBAAzoUj1BsK4dUlZsPlDftHmb99XXfA",
});

test("getFaunaUserManager", () => {
  expect(getFaunaUserManager()).toBeDefined();
});
