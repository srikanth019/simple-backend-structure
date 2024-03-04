import { NextFunction, Request, Response } from "express";
import { ApiError } from "@utils";

export const ErrorMiddleware = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || "Something went wrong";
    const success: boolean = false;

    res.status(status).json({ message, success });
  } catch (error) {
    next(error);
  }
};
