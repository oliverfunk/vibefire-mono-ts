import { Result, type AsyncResult } from "@vibefire/utils";

import { ManagerRuleViolation } from "./errors";

export const unwrapNullablePromise = async <T, E extends Error>(
  value: Promise<T | null | undefined>,
  message: string,
) => {
  const t = await value;
  if (!!t) {
    return t;
  }
  throw new ManagerRuleViolation(message);
};

export const managerResult = async <T>(
  fn: () => Promise<T>,
): AsyncResult<T, Error> => {
  try {
    const value = await fn();

    return Result.ok(value);
  } catch (error) {
    if (error instanceof ManagerRuleViolation) {
      return Result.err(error);
    }
    console.error(error);
    return Result.err(error as Error);
  }
};
