import { Router } from "express";
import { Routes } from "@interface";
import { UserController } from "@controller";
import { isAuthenticated, upload } from "@/middleware";
import { ValidationMiddleware } from "@/middleware/validation.middleware";
import { CreateUserDto } from "@/dtos/user.dto";

export class UserRoutes implements Routes {
  public router = Router();
  public path = "/user";
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/signup`,
      upload.single("avatar"),
      ValidationMiddleware(CreateUserDto),
      this.userController.signUp
    );

    this.router.post(`${this.path}/login`, this.userController.logIn);

    this.router.post(
      `${this.path}/logout`,
      isAuthenticated,
      this.userController.logOut
    );

    this.router.post(
      `${this.path}/refresh-token`,
      this.userController.refreshToken
    );

    this.router.post(
      `${this.path}/change-password`,
      isAuthenticated,
      this.userController.changeCurrentPassword
    );

    this.router.get(
      `${this.path}/`,
      // isAuthenticated,
      this.userController.getUsers
    );

    this.router.get(
      `${this.path}/:userId`,
      // isAuthenticated,
      this.userController.getUser
    );

    this.router.patch(
      `${this.path}/:userId/update-user`,
      isAuthenticated,
      upload.single("avatar"),
      this.userController.updateUser
    );

    this.router.delete(
      `${this.path}/:userId`,
      isAuthenticated,
      this.userController.deleteUser
    );
  }
}
