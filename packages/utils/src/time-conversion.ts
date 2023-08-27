import { DateTime } from "luxon";

export const isoStrToEpochSeconds = (isoStr: string, timeZone?: string) => {
  return DateTime.fromISO(isoStr, {
    zone: timeZone,
  }).toUnixInteger();
};

export const epochSecsToDateTime = (epoch: number, timeZone: string) =>
  DateTime.fromSeconds(epoch, {
    zone: timeZone,
  });

export const epochSecsAtNewTimeZone = (
  epoch: number,
  oldTimeZone: string,
  newTimeZone: string,
) => {
  const dateTime = epochSecsToDateTime(epoch, oldTimeZone);
  const newTZDateTime = dateTime.setZone(newTimeZone, { keepLocalTime: true });
  return newTZDateTime.toUnixInteger();
};
