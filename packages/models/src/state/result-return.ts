import { type TModelVibefireError } from "!models/data/vibefire-error";

type ResultReturnOk<T> = {
  ok: true;
  value: T;
};
type ResultReturnErr = {
  ok: false;
  error: TModelVibefireError;
};
export type ResultReturn<T> = ResultReturnOk<T> | ResultReturnErr;
