import { plainToInstance } from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils";
import { HTTP_STATUS_CODES } from "@/constants";
import fs from "fs";
import util from "util";
const unlinkFile = util.promisify(fs.unlink);

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export const ValidationMiddleware = (
  type: any,
  skipMissingProperties = false,
  whitelist = false,
  forbidNonWhitelisted = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    validateOrReject(dto, {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    })
      .then(() => {
        req.body = dto;
        next();
      })
      .catch((errors: ValidationError[]) => {
        if (req.file) {
          unlinkFile(req.file.path);
        }
        if (req.files && Array.isArray(req.files)) {
          try {
            for (const file of req.files) {
              unlinkFile(file.path);
            }
          } catch (unlinkError) {
            console.error(unlinkError);
          }
        }

        //If you want to show all the error at a time
        // const message = errors
        //   .map((error: ValidationError) =>
        //     (Object as any).values(error?.constraints)
        //   )
        //   .join(", ");

        //if you want to show first field validation
        // const message = Object.values(errors[0]?.constraints || {}).join(", ");

        //if you want to show only one validation i.e for first field
        const firstError = errors[0];
        const message = firstError
          ? Object.values(firstError.constraints || {})[0]
          : undefined;

        next(
          new ApiError(
            HTTP_STATUS_CODES.BAD_REQUEST,
            message || "SOME_ERROR_OCCUR_IN_VALIDATION"
          )
        );
      });
  };
};
