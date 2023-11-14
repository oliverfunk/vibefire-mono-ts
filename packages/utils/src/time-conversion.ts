import { DateTime } from "luxon";

import { type TimeOfDayT } from "@vibefire/models";

export const MONTH_DATE_TIME_FORMAT = "LLL d, T";
export const MONTH_DATE_TIME_LB_FORMAT = "LLL d\nT";
export const DATE_STR_FORMAT = "yyyyMMdd";

export const toDateStr = (dt: DateTime) => dt.toFormat(DATE_STR_FORMAT);
export const toQueryStr = (dt: DateTime, tod: TimeOfDayT) =>
  toDateStr(dt) + "/" + tod;

export const nowAsUTC = () =>
  DateTime.now().setZone("utc", { keepLocalTime: true });

export const isoNTZToUTCDateTime = (isoStr: string) => {
  return DateTime.fromISO(isoStr, { zone: "utc" });
};

export const isoNTZToTZDateTime = (isoStr: string, timeZone: string) => {
  return isoNTZToUTCDateTime(isoStr).setZone(timeZone, {
    keepLocalTime: true,
  });
};

export const isoNTZToTZEpochSecs = (isoStr: string, timeZone: string) => {
  return isoNTZToTZDateTime(isoStr, timeZone).toUnixInteger();
};
