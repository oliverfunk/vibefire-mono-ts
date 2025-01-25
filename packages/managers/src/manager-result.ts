import { type AsyncResult, type TModelVibefireError } from "@vibefire/models";

export class ManagerErrorResponse extends Error {
  constructor(readonly value: TModelVibefireError) {
    super();
    this.name = "ManagerErrorResponse";
  }
}

export type ManagerAsyncResult<T> = AsyncResult<T, ManagerErrorResponse>;
