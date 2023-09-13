import { DateTime } from "luxon";

export const isoNTZToTZEpochSecs = (isoStr: string, timeZone: string) => {
  return isoNTZToDTAtTZ(isoStr, timeZone).toUnixInteger();
};

export const isoNTZToDTAtTZ = (isoStr: string, timeZone: string) => {
  return DateTime.fromISO(isoStr, { zone: "utc" }).setZone(timeZone, {
    keepLocalTime: true,
  });
};

export const nowAsUTC = () =>
  DateTime.now().setZone("utc", { keepLocalTime: true });

// export const epochSecsAtNewTimeZone = (
//   epoch: number,
//   oldTimeZone: string,
//   newTimeZone: string,
// ) => {
//   const dateTime = epochSecsToTZDateTime(epoch, oldTimeZone);
//   const newTZDateTime = dateTime.setZone(newTimeZone, { keepLocalTime: true });
//   return newTZDateTime.toUnixInteger();
// };
