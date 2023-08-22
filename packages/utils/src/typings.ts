type FinalType<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
export type Replace<T, U extends Partial<Record<keyof T, unknown>>> = FinalType<
  Omit<T, keyof U> & U
>;

export type WithPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export const removeUndef = (obj: { [key: string]: unknown }) =>
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
