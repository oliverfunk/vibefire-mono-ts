import { HTTPException } from "hono/http-exception";

export const validateToHttpExp = <T>(fn: () => T | undefined | null): T => {
  try {
    const r = fn();
    if (r === undefined || r === null) {
      throw new HTTPException(401, { message: "invalid_token" });
    }
    return r;
  } catch (err) {
    throw new HTTPException(401, { message: "invalid_token" });
  }
};
