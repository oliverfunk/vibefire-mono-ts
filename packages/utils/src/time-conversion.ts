import { DateTime } from "luxon";

export const MONTH_DATE_TIME_FORMAT = "LLL d, T";
export const MONTH_DATE_TIME_LB_FORMAT = "LLL d\nT";
export const H24_TIME_FORMAT = "T";

export const nowDateStr = () => DateTime.now().toFormat("yyyyMMdd");

export const nowAsUTC = () =>
  DateTime.now().setZone("utc", { keepLocalTime: true });

export const isoNTZToUTCDateTime = (isoStr: string) => {
  return DateTime.fromISO(isoStr, { zone: "utc" });
};

export const isoNTZToTZDateTime = (isoStr: string, timeZone: string) => {
  return DateTime.fromISO(isoStr, { zone: "utc" }).setZone(timeZone, {
    keepLocalTime: true,
  });
};

export const isoNTZToTZEpochSecs = (isoStr: string, timeZone: string) => {
  return isoNTZToTZDateTime(isoStr, timeZone).toUnixInteger();
};
