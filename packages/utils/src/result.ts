import { ManagerRuleError } from "../../managers/src/errors";
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

type ResultReturnOk<T> = {
  ok: true;
  value: T;
  ise: false;
};
type ResultReturnErr = {
  ok: false;
  message: string;
  ise: false;
};
type ResultReturnErrIse = {
  ok: false;
  message: string;
  ise: true;
};
export type ResultReturn<T> =
  | ResultReturnOk<T>
  | ResultReturnErr
  | ResultReturnErrIse;

const returnIse = (error: Error): ResultReturnErrIse => {
  console.error(error);
  return {
    ok: false,
    message: "Something went wrong, we're looking into it. :(",
    ise: true,
  };
};

export const resultReturn = <T, E extends Error>(
  result: Result<T, E>,
): ResultReturn<T> => {
  try {
    return result.unwrap(
      (value) => ({
        ok: true,
        value,
        ise: false,
      }),
      (error) => ({
        ok: false,
        message: error.message,
        ise: false,
      }),
    );
  } catch (error) {
    return returnIse(error as Error);
  }
};

export const asyncResultReturn = async <T, E extends Error>(
  asyncResult: AsyncResult<T, E>,
): Promise<ResultReturn<T>> => {
  try {
    return resultReturn(await asyncResult);
  } catch (error) {
    return returnIse(error as Error);
  }
};
