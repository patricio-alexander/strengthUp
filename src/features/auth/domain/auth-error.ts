export enum CodeErrors {
  INVALID_CREDENTIALS = "invalid_credentials",
  EMAIL_EXISTS = "email_exists",
  NETWORK_ERROR = "network_error",
  EMAIL_INVALID = "email_address_invalid",
  SAME_PASSWORD = "same_password",
  ERROR_LOGOUT = "error_logout",
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}
