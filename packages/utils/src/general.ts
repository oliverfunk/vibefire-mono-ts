import { type CoordT } from "@vibefire/models";

export const trimAndCropText = (text: string, length: number = 500) => {
  text = text.trim();
  if (text.length > length) {
    return text.slice(0, length);
  }
  return text;
};

export const isCoordZeroZero = (coord: CoordT) =>
  coord.lat === 0 && coord.lng === 0;

export const removeUndef = (
  obj: { [key: string]: unknown },
  removeEmpty = true,
) => {
  for (const key in obj) {
    const o = obj[key];
    if (o === undefined) {
      delete obj[key];
    } else if (o === null) {
      // leave it
    } else if (typeof o === "object") {
      if (Array.isArray(o)) {
        // filter out null, undefined, and empty string from the array
        obj[key] = (o as Array<unknown>).filter(
          (value) => value !== null && value !== undefined && value !== "",
        );
      } else {
        removeUndef(o as { [key: string]: unknown });

        if (removeEmpty && Object.keys(o).length === 0) {
          delete obj[key];
        }
      }
    }
  }
  return obj;
};

export const randomDigits = (n: number): string =>
  [...Array<number>(n)].map((_) => (Math.random() * 10) | 0).join("");

export const randomAlphaNumeric = (n: number): string =>
  [...Array<number>(n)]
    .map((_) =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
        Math.floor(Math.random() * 62),
      ),
    )
    .join("");

export const isValidUuidV4 = (uuid: string): boolean => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

export const isPositionEqual = (coord1?: CoordT, coord2?: CoordT): boolean =>
  // will be equal when both undefined
  coord1 === coord2 ||
  (coord1 !== undefined &&
    coord2 !== undefined &&
    coord1.lat === coord2.lat &&
    coord1.lng === coord2.lng);
