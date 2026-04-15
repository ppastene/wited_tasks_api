import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsEmail({}, {message: "email is not a valid email"})
  @ApiProperty({ example: 'foo@ebar.com' })
  email: string;

  @IsString({ message: "password must be a string" })
  @MinLength(6, { message: "password must be 6 characters long" })
  @ApiProperty({ example: '123456', minLength: 6 })
  password: string;
}