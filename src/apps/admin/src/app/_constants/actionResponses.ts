import { Alert, AlertType } from "@beatattoos/ui";

export const AUTHENTICATION_ERROR: Alert = {
  type: AlertType.error,
  message: "You are not allowed to perform this operation",
};

export const CREDENTIALS_PARSING_ERROR: Alert = {
  type: AlertType.error,
  message: "An error occurred while parsing the credentials",
};

export const MISSING_COUNTRY_ERROR: Alert = {
  type: AlertType.error,
  message: "Entered country does not exist",
};

export const INVALID_STATE_PROVINCE_ERROR: Alert = {
  type: AlertType.error,
  message: "Entered state/province is invalid",
};

export const INVALID_CITY_ERROR: Alert = {
  type: AlertType.error,
  message: "Entered city is invalid",
};

export const REQUIRED_CITY_ERROR: Alert = {
  type: AlertType.error,
  message: "You must choose a city for the entered state/province",
};

export const EMAIL_IN_USE_ERROR: Alert = {
  type: AlertType.error,
  message: "Email address is already in use",
};

export const EMAIL_IN_USE_FAILED_ERROR: Alert = {
  type: AlertType.error,
  message: "An error occurred while checking for email availability",
};
