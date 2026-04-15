/*import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, {message: "email is not a valid email"})
  email: string;

  @IsString({ message: "password must be a string" })
  @MinLength(6, { message: "password must be 6 characters long" })
  password: string;
}
  */
import { RegisterDto } from './register.dto';

export class LoginDto extends RegisterDto {}