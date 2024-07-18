import { Alert, AlertType } from "@beatattoos/ui";

export const CREATE_CLIENT_SUCCESS: Alert = {
  type: AlertType.success,
  message: "Successfully created client account",
};

export const CREATE_CLIENT_FAILED_ERROR: Alert = {
  type: AlertType.error,
  message: "An error occurred while creating the client",
};
