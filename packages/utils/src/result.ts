import { ManagerRuleViolation } from "../../managers/src/errors";
import { AsyncResult, Result } from "./_result";

// Result.Ok.prototype.chain_async = function (a: string) {};
// Result.err.prototype.chain_async = function (a: string) {};

// re-export Result from @badrap/result
// only need to use this utils package then
export { Result, type AsyncResult };

export const resultChainAsync =
  <T, E extends Error, U>(fn: (value: T) => AsyncResult<U, E>) =>
  (r: Result<T, E>) =>
    r.chainAsync(fn);

export const resultChain =
  <T, E extends Error, U>(fn: (value: T) => Result<U, E>) =>
  (r: Result<T, E>) =>
    r.chain(fn);

export const filterNone = <T>(value: T | undefined | null): value is T =>
  value !== undefined && value !== null;

export const filterNoneResult = <T>(
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
  return result.chain((value) => filterNoneResult(value, message));
};
