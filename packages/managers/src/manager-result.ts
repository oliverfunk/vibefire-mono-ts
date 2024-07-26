import { type TModelVibefireError } from "@vibefire/models";
import { type AsyncResult } from "@vibefire/utils";

export class ManagerErrorResponse extends Error {
  constructor(readonly value: TModelVibefireError) {
    super();
    this.name = "ManagerErrorResponse";
  }
}

export type ManagerAsyncResult<T> = AsyncResult<T, ManagerErrorResponse>;
