import { Request } from "express";

export interface User {
  _id?: any;
  username: string;
  email: string;
  password: string;
  fullName: string;
  avatar?: string;
  refreshToken: string;
}

export interface CustomUserRequest<T = any> extends Request {
  user?: T;
}
