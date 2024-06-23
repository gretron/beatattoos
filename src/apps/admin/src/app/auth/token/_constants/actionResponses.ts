import { Alert, AlertType } from "@beatattoos/ui/Alert";

export const TOKEN_PARSING_ERROR: Alert = {
  type: AlertType.error,
  message: "An error occurred while parsing the token",
};

export const INCORRECT_TOKEN_ERROR: Alert = {
  type: AlertType.error,
  message: "Entered token does not correspond to the admin token",
};
