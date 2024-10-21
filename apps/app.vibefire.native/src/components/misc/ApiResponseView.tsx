import { type ReactNode } from "react";

import { type TModelVibefireError } from "@vibefire/models";

import { type ApiResponse } from "!api/utils";

export const ApiResponseView = <T,>(props: {
  response: ApiResponse<T>;
  ok: (data: T) => ReactNode;
  error: (error: TModelVibefireError) => ReactNode;
}) => {
  const { response, ok, error } = props;

  switch (response.ok) {
    case true:
      return ok(response.value);
    case false:
      return error(response.error);
  }
};
