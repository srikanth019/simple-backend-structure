import { User } from "@/interface";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto implements Partial<User> {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(12)
  username?: string;

  @IsString()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(12)
  password?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(12)
  fullName?: string | undefined;

  @IsString()
  @IsOptional()
  avatar?: string | undefined;
}
