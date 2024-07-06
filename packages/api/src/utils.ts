import { ManagerRuleViolation } from "@vibefire/managers/errors";
import { type ResultReturn } from "@vibefire/models";
import { type AsyncResult } from "@vibefire/utils";

export type ApiReturn<T> = ResultReturn<T>;

export const wrapApiReturn = async <T>(
  fn: () => Promise<T>,
): Promise<ApiReturn<T>> => {
  try {
    const value = await fn();
    return {
      ok: true,
      value,
      ise: false,
    };
  } catch (error) {
    // although logging should primarily be done in the managers,
    // we do it here because api's may call other packages
    // although they shouldn't
    console.error(error);
    return {
      ok: false,
      message: "Something went wrong, we're looking into it. :(",
      ise: true,
    };
  }
};

export const wrapManagerReturn = async <T>(
  fn: () => AsyncResult<T>,
): Promise<ApiReturn<T>> => {
  try {
    const res = await fn();

    if (res.isOk) {
      return {
        ok: true,
        value: res.value,
        ise: false,
      };
    }

    if (res.error instanceof ManagerRuleViolation) {
      return {
        ok: false,
        message: res.error.message,
        ise: false,
      };
    } else {
      return {
        ok: false,
        message: "Something went wrong, we're looking into it. :(",
        ise: true,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Something went wrong, we're looking into it. :(",
      ise: true,
    };
  }
};
