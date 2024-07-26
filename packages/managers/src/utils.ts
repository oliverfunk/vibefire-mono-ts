import { FaunaCallAborted } from "@vibefire/services/fauna";
import { Result, wrapToAsyncResult, type AsyncResult } from "@vibefire/utils";

import { ManagerRuleViolation } from "./errors";
import {
  ManagerErrorResponse,
  type ManagerAsyncResult,
} from "./manager-result";

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
): ManagerAsyncResult<T> => {
  return (await wrapToAsyncResult(fn)).map(
    (v) => v,
    (e) => {
      if (e instanceof ManagerRuleViolation) {
        return new ManagerErrorResponse({
          code: "rule_violation",
          message: e.message,
        });
      }
      if (e instanceof FaunaCallAborted && e.value.code !== "ise") {
        return new ManagerErrorResponse(e.value);
      }
      console.error(e);
      return new ManagerErrorResponse({
        code: "ise",
        message: "Something went wrong, we're looking into it. :(",
      });
    },
  );
};
