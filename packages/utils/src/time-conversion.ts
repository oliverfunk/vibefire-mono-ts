import { DateTime } from "luxon";

export const MONTH_DATE_TIME_FORMAT = "LLL d, T";
export const MONTH_DATE_TIME_LB_FORMAT = "LLL d\nT";
export const DATE_STR_FORMAT = "yyyyMMdd";

export const toDateStr = (dt: DateTime) => dt.toFormat(DATE_STR_FORMAT);

export const nowAtUTC = () => DateTime.now().setZone("utc");

export const nowAsUTC = () =>
  DateTime.now().setZone("utc", { keepLocalTime: true });

export const nowAsUTCNoTime = () =>
  nowAsUTC().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

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

export const displayPeriodsBetween = (
  startIsoStr: string,
  endIsoStr?: string | null,
  hardLimit = 20,
) => {
  const start = isoNTZToUTCDateTime(startIsoStr);
  const end = endIsoStr ? isoNTZToUTCDateTime(endIsoStr) : undefined;

  const periods = [];

  let current = start;
  do {
    if (periods.length >= hardLimit) {
      throw new Error(
        `displayPeriodsBetween: hardLimit of ${hardLimit} exceeded`,
      );
    }
    periods.push(toDateStr(current));
    current = current.plus({ day: 1 });
  } while (!!end && current <= end);

  return periods;
};

export const displayPeriodsFor = (
  startIsoStr: string,
  numberOfDays: number,
) => {
  const start = isoNTZToUTCDateTime(startIsoStr);

  const periods = [];

  let current = start;
  do {
    periods.push(toDateStr(current));
    current = current.plus({ day: 1 });
  } while (periods.length < numberOfDays);

  return periods;
};
