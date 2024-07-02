import { Alert, AlertType } from "@beatattoos/ui/Alert";

export const CREDENTIALS_ERROR: Alert = {
  type: AlertType.error,
  message: "Entered credentials do not match",
};

export const OPERATIONS_ERROR: Alert = {
  type: AlertType.error,
  message: "An error occurred while logging into administrator account",
};
