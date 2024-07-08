import { Alert, AlertType } from "@beatattoos/ui/Alert";

export const AUTHENTICATION_ERROR: Alert = {
  type: AlertType.error,
  message: "You are not allowed to perform this operation",
};

export const CREDENTIALS_PARSING_ERROR: Alert = {
  type: AlertType.error,
  message: "An error occurred while parsing the credentials",
};

export const EMAIL_IN_USE_ERROR: Alert = {
  type: AlertType.error,
  message: "Email address is already in use",
};

export const EMAIL_IN_USE_FAILED_ERROR: Alert = {
  type: AlertType.error,
  message: "An error occurred while checking for email availability",
};
