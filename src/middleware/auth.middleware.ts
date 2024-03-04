import { Response, NextFunction } from "express";
import { ApiError } from "@/utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@/config";
import { UserModel } from "@/models/user.model";
import { CustomUserRequest } from "@/interface";

// export const isAuthenticated = async (
//   req: CustomUserRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");
//     console.log(/token/, token);
//     if (!token) {
//       throw new ApiError(401, "Token missing");
//     }

//     const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET!);
//     console.log(/decodedToken/, decodedToken);

//     const tokenUser = await UserModel.findOne({
//       _id: (decodedToken as JwtPayload)._id,
//       refreshToken: {
//         $ne: null,
//       },
//     });

//     if (!tokenUser) {
//       throw new ApiError(401, "Token expired");
//     }
//     req.user = tokenUser;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

export const isAuthenticated = async (
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Token missing");

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET!);
    const tokenUser = await UserModel.findOne({
      _id: (decodedToken as JwtPayload)._id,
      refreshToken: { $ne: null },
    });

    if (!tokenUser) throw new ApiError(401, "Token expired");

    req.user = tokenUser;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      next(new ApiError(401, "Token expired"));
    } else {
      next(error);
    }
  }
};
