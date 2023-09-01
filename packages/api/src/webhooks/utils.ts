import { HTTPException } from "hono/http-exception";

export const validateToHttpExp = <T>(fn: () => T): T => {
  try {
    return fn();
  } catch (err) {
    throw new HTTPException(401, { message: "invalid_token" });
  }
};
