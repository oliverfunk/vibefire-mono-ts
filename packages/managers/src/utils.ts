import { Result, wrapToAsyncResult, type AsyncResult } from "@vibefire/utils";

import { ManagerRuleViolation } from "./errors";

export type MResult<T> = Result<T, ManagerRuleViolation>;
export type MAResult<T> = AsyncResult<T, ManagerRuleViolation>;

export const nullablePromiseToRes = async <T>(
  value: Promise<T | null | undefined>,
  message: string,
): MAResult<T> => {
  const t = await value;
  if (!!t) {
    return Result.ok(t);
  }
  return Result.err(new ManagerRuleViolation(message));
};

export const managerReturn = async <T>(
  fn: () => Promise<T>,
): AsyncResult<T, Error> => {
  const r = await wrapToAsyncResult(fn);
  if (r.isErr && !(r.error instanceof ManagerRuleViolation)) {
    console.error(r.error);
  }
  return r;
};
