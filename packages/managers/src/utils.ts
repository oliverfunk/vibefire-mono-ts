import {
  ManagerErrorResponse,
  Result,
  wrapToAsyncResult,
  type ManagerAsyncResult,
} from "@vibefire/models";
import { FaunaCallAborted } from "@vibefire/services/fauna";

import { ManagerRuleViolation } from "./errors";

export const nullablePromiseToRes = async <T>(
  value: Promise<T | null | undefined>,
  message: string,
): ManagerAsyncResult<T> => {
  const t = await value;
  if (!!t) {
    return Result.ok(t);
  }
  return Result.err(
    new ManagerErrorResponse({
      code: "does_not_exist",
      action: "",
      message,
    }),
  );
};

export const managerReturn = async <T>(
  fn: () => Promise<T>,
): ManagerAsyncResult<T> => {
  return (await wrapToAsyncResult(fn)).map(
    (v) => v,
    (e) => {
      console.error("managerReturn error", e);
      if (e instanceof ManagerErrorResponse) {
        return e;
      }
      if (e instanceof ManagerRuleViolation) {
        return new ManagerErrorResponse({
          code: "rule_violation",
          action: "",
          message: e.message,
        });
      }
      if (e instanceof FaunaCallAborted && e.value.code !== "ise") {
        return new ManagerErrorResponse(e.value);
      }
      return new ManagerErrorResponse({
        code: "ise",
        action: "manager",
        message: "Something went wrong, we're looking into it. :(",
      });
    },
  );
};
