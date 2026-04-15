import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, {message: "property email is not a valid email"})
  email: string;

  @IsString({ message: "property password must be a string" })
  @MinLength(6, { message: "property password must be 6 characters long" })
  password: string;
}