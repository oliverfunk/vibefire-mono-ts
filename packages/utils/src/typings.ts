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

export type Permutation<T, K = T> = [T] extends [never]
  ? []
  : K extends K
    ? [K, ...Permutation<Exclude<T, K>>]
    : never;
