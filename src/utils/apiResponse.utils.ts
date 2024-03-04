import { Response } from "express";
import i18n from "i18n";

class ApiResponse {
  public statusCode: number;
  public message?: string;
  public data: any;
  public success?: boolean;

  constructor(statusCode: number, message: string, data: any) {
    this.statusCode = statusCode;
    this.message = i18n.__(message || "SUCCESS");
    this.data = data;
    this.success = true;
    Object.setPrototypeOf(this, ApiResponse.prototype);
  }

  public sendSuccessResponse(res: Response) {
    return res
      .status(this.statusCode)
      .json({ message: this.message, data: this.data, success: this.success });
  }
}

export { ApiResponse };
