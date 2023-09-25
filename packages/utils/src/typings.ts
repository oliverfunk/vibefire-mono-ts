import type { PartialDeep } from "type-fest";

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
    if (obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      if (Array.isArray(obj[key])) {
        // filter out null, undefined, and empty string from the array
        obj[key] = (obj[key] as Array<unknown>).filter(
          (value) => value !== null && value !== undefined && value !== "",
        );
      } else {
        removeUndef(obj[key] as { [key: string]: unknown });

        if (removeEmpty && Object.keys(obj[key]).length === 0) {
          delete obj[key];
        }
      }
    }
  }
  return obj;
};
