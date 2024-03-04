import { Request, Response, NextFunction } from "express";
import { UserService } from "@/services";
import { CustomUserRequest, User } from "@interface";
import { ApiError, ApiResponse } from "@/utils";
import fs from "fs";
import { HTTP_STATUS_CODES } from "@/constants";
export class UserController extends UserService {
  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const avatar = req.file?.path;
      const { username, fullName, email, password } = req.body;
      if (
        ![username, fullName, email, username, password].every(
          (field) => field && field.trim() !== ""
        )
      ) {
        if (avatar) fs.unlinkSync(avatar);
        throw new ApiError(
          HTTP_STATUS_CODES.FORBIDDEN,
          "Please provide required fields"
        );
      }

      const userData: User = req.body;
      const signUpUserData: User = await this.signup(userData, avatar);
      // With success response class
      // return res
      //   .status(201)
      //   .json(
      //     new ApiResponse(200, signUpUserData, "User registered successfully")
      //   );
      const response = new ApiResponse(
        HTTP_STATUS_CODES.CREATED,
        "User registered successfully",
        signUpUserData
      );
      return response.sendSuccessResponse(res);
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;
      if (!(username || email) && password) {
        throw new ApiError(
          HTTP_STATUS_CODES.FORBIDDEN,
          "Please provide required fields for Login"
        );
      }
      const loginData: User = req.body;
      const { accessToken, refreshToken } = await this.login(loginData);
      const options = {
        httpOnly: true,
        secure: true,
      };
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(HTTP_STATUS_CODES.OK, "User login successfully", {
            accessToken,
            refreshToken,
          })
        );
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (
    req: CustomUserRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { user } = req;

    await this.logout(user);
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(
        new ApiResponse(HTTP_STATUS_CODES.OK, "User logout successfully", {})
      );
  };

  public refreshToken = async (
    req: CustomUserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const oldRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;
      if (!oldRefreshToken) {
        throw new ApiError(
          HTTP_STATUS_CODES.UNAUTHORIZED,
          "Unauthorized request"
        );
      }
      const { accessToken, refreshToken } = await this.getNewRefreshToken(
        oldRefreshToken
      );
      const options = {
        httpOnly: true,
        secure: true,
      };
      return res
        .status(HTTP_STATUS_CODES.CREATED)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(HTTP_STATUS_CODES.OK, "Access token refreshed", {
            accessToken,
            refreshToken,
          })
        );
    } catch (error) {
      next(error);
    }
  };

  public changeCurrentPassword = async (
    req: CustomUserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { user } = req;
      const { currentPassword, newPassword } = req.body;
      await this.changePassword(user, currentPassword, newPassword);
      return res
        .status(200)
        .json(
          new ApiResponse(
            HTTP_STATUS_CODES.OK,
            "Password changed successfully",
            {}
          )
        );
    } catch (error) {
      next(error);
    }
  };

  public getUsers = async (
    req: CustomUserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1; // Convert to number or default to 1
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const userData = await this.GetUsers(page, limit);

      if (!userData.users?.length) {
        throw new ApiError(HTTP_STATUS_CODES.NOT_FOUND, "USERS_DOES_NOT_EXIST");
      }

      return new ApiResponse(
        HTTP_STATUS_CODES.OK,
        "USERS_FETCHED_SUCCESSFULLY",
        userData
      ).sendSuccessResponse(res);
      // return new ApiResponse(200, "Users fetched successfully", userData);
    } catch (error) {
      next(error);
    }
  };

  public getUser = async (
    req: CustomUserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;
      const user = await this.GetUser(userId);
      if (!user) {
        throw new ApiError(HTTP_STATUS_CODES.NOT_FOUND, `USER_DOES_NOT_EXIST`);
      }
      return res
        .status(200)
        .json(new ApiResponse(HTTP_STATUS_CODES.OK, "USER_FETCHED", user));
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    req: CustomUserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { fullName, username } = req.body;

      const avatar = req.file?.path;

      const { userId } = req.params;
      if (!username || !fullName) {
        throw new ApiError(
          HTTP_STATUS_CODES.FORBIDDEN,
          "email and fullName required"
        );
      }
      const updatedUser = await this.UpdateUser(
        userId,
        fullName,
        username,
        avatar
      );
      return res
        .status(200)
        .json(
          new ApiResponse(HTTP_STATUS_CODES.OK, "User updated", updatedUser)
        );
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: CustomUserRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;
      const data = await this.DeleteUser(userId);
      console.log(data);

      if (!data) {
        throw new ApiError(
          HTTP_STATUS_CODES.NOT_FOUND,
          `User not found with id ${userId}`
        );
      }
      return res
        .status(200)
        .json(new ApiResponse(HTTP_STATUS_CODES.OK, "User deleted.", data));
    } catch (error) {
      next(error);
    }
  };
}
