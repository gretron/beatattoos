export enum AlertType {
  error,
  success,
  warning,
  info,
}

export type Alert = {
  type: AlertType;
  message?: string;
};
