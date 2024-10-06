import { type ManagerAsyncResult } from "@vibefire/managers/result";
import { type ResultReturn } from "@vibefire/models";

export type ApiResponse<T> = ResultReturn<T>;

export const wrapApiReturn = async <T>(
  fn: () => Promise<T>,
): Promise<ApiResponse<T>> => {
  try {
    const value = await fn();
    return {
      ok: true,
      value,
    };
  } catch (error) {
    // although logging should primarily be done in the managers,
    // we do it here because api's may call other packages
    // although they shouldn't
    console.error(error);
    return {
      ok: false,
      error: {
        code: "ise",
        message: "Something went wrong, we're looking into it. :(",
        action: "",
      },
    };
  }
};

export const wrapManagerReturn = async <T>(
  fn: () => ManagerAsyncResult<T>,
): Promise<ApiResponse<T>> => {
  try {
    const res = await fn();

    if (res.isOk) {
      return {
        ok: true,
        value: res.value,
      };
    }

    if (res.isErr) {
      return {
        ok: false,
        error: res.error.value,
      };
    }
  } catch (error) {
    console.error(error);
  }

  return {
    ok: false,
    error: {
      code: "ise",
      message: "Something went wrong, we're looking into it. :(",
      action: "api",
    },
  };
};
