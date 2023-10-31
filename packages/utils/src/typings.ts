import type { PartialDeep } from "type-fest";

export type ImageVariant = "public";

type FinalType<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
export type Replace<T, U extends Partial<Record<keyof T, unknown>>> = FinalType<
  Omit<T, keyof U> & U
>;

export type WithPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type PartialExceptRequired<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>;

export type PartialDeepExceptRequired<T, K extends keyof T> = PartialDeep<
  Omit<T, K>
> &
  Required<Pick<T, K>>;

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
