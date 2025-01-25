import { type TModelVibefireError } from "!models/data/vibefire-error";
import { type AsyncResult } from "!models/result";

export class ManagerErrorResponse extends Error {
  constructor(readonly value: TModelVibefireError) {
    super();
    this.name = "ManagerErrorResponse";
  }
}

export type ManagerAsyncResult<T> = AsyncResult<T, ManagerErrorResponse>;
