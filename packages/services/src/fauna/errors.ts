import { type TModelVibefireError } from "@vibefire/models";

export class FaunaCallAborted extends Error {
  constructor(readonly value: TModelVibefireError) {
    super();
    this.name = "FaunaCallAborted";
  }
}
