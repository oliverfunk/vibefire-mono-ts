import { displayPeriodsBetween } from "./time-conversion";

test("setting up events", () => {
  const a = displayPeriodsBetween(
    "2021-03-01T00:00:00.000Z",
    "2021-03-03T00:00:00.000Z",
    2,
  );
  console.log(JSON.stringify(a, null, 2));
});
