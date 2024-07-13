import { Result } from "@badrap/result";

// re-export Result from @badrap/result
// only need to use this utils package then
export { Result };

export type AsyncResult<T, E extends Error = Error> = Promise<Result<T, E>>;

export const filterNone = <T>(value: T | undefined | null): value is T =>
  value !== undefined && value !== null;

export const filterNoneToResult = <T>(
  value: T | undefined | null,
  message?: string,
): Result<T, Error> =>
  filterNone(value)
    ? Result.ok(value)
    : Result.err(new Error(message ?? "Value is none"));

export const fromNoneResult = <T>(
  result: Result<T | undefined | null, Error>,
  message?: string,
) => {
  return result.chain((value) => filterNoneToResult(value, message));
};

export const wrapToResult = <T, E extends Error>(fn: () => T): Result<T, E> => {
  try {
    return Result.ok(fn());
  } catch (e) {
    return Result.err(e as E);
  }
};

export const wrapToAsyncResult = async <T, E extends Error>(
  fn: () => Promise<T>,
): AsyncResult<T, E> => {
  try {
    return Result.ok(await fn());
  } catch (e) {
    return Result.err(e as E);
  }
};
