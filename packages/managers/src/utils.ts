import { ResultReturn } from "@vibefire/utils";

import { ManagerRuleError } from "./errors";

export const unwrapNullablePromise = async <T, E extends Error>(
  value: Promise<T | null | undefined>,
  message: string,
) => {
  const t = await value;
  if (!!t) {
    return t;
  }
  throw new ManagerRuleError(message);
};

export const asyncWrapReturn = async <T>(
  fn: () => Promise<T>,
): Promise<ResultReturn<T>> => {
  try {
    const value = await fn();
    return {
      ok: true,
      value,
      ise: false,
    };
  } catch (error) {
    if (error instanceof ManagerRuleError) {
      return {
        ok: false,
        message: error.message,
        ise: false,
      };
    }
    console.error(error);
    return {
      ok: false,
      message: "Something went wrong, we're looking into it. :(",
      ise: true,
    };
  }
};
