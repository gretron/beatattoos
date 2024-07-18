import { Alert, AlertType } from "@beatattoos/ui";

export const EXISTING_ACCOUNT_ERROR: Alert = {
  type: AlertType.error,
  message: "The administrator user already exists",
};

export const EXISTING_ACCOUNT_FAILED_ERROR: Alert = {
  type: AlertType.error,
  message:
    "An error occurred while checking for an existing administrator account",
};

export const CREATE_USER_FAILED_ERROR: Alert = {
  type: AlertType.error,
  message: "An error occurred while creating the admin user",
};
