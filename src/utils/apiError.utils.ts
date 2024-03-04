export class ApiError extends Error {
  public status: number;
  public message: string;

  constructor(status?: number, message?: string) {
    super(message || "SOMETHING_WENT_WRONG");
    this.status = status || 500;
    this.message = i18n.__(message || "SOMETHING_WENT_WRONG");
  }
}
