type ResultReturnOk<T> = {
  ok: true;
  value: T;
  ise: false;
};
type ResultReturnErr = {
  ok: false;
  message: string;
  ise: false;
};
type ResultReturnErrIse = {
  ok: false;
  message: string;
  ise: true;
};
export type ResultReturn<T> =
  | ResultReturnOk<T>
  | ResultReturnErr
  | ResultReturnErrIse;
