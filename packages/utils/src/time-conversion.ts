import { DateTime } from "luxon";

export const MONTH_DATE_TIME_FORMAT = "LLL d, T";
export const MONTH_DATE_TIME_LB_FORMAT = "LLL d\nT";
export const H24_TIME_FORMAT = "T";

export const isoNTZToTZEpochSecs = (isoStr: string, timeZone: string) => {
  return isoNTZToDateTimeAtTZ(isoStr, timeZone).toUnixInteger();
};

export const isoNTZToDateTime = (isoStr: string) => {
  return DateTime.fromISO(isoStr, { zone: "utc" });
};

export const isoNTZToDateTimeAtTZ = (isoStr: string, timeZone: string) => {
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
