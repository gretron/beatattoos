import { Alert, AlertType } from "@beatattoos/ui/Alert";

export const CREDENTIALS_PARSING_ERROR: Alert = {
  type: AlertType.error,
  message: "An error occurred while parsing the credentials",
};

export const EXISTING_ACCOUNT_ERROR: Alert = {
  type: AlertType.error,
  message: "The administrator user already exists",
};

export const EXISTING_ACCOUNT_FAILED_ERROR: Alert = {
  type: AlertType.error,
  message:
    "An error occurred while checking for an existing administrator account",
};

export const EMAIL_IN_USE_ERROR: Alert = {
  type: AlertType.error,
  message: "Email address is already in use",
};

export const EMAIL_IN_USE_FAILED_ERROR: Alert = {
  type: AlertType.error,
  message: "An error occurred while checking for email availability",
};

export const CREATE_USER_FAILED_ERROR: Alert = {
  type: AlertType.error,
  message: "An error occurred while creating the admin user",
};
