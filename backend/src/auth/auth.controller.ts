import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  @ApiResponse({ status: 400, description: 'Valores de email y password invalidos' })
  @ApiResponse({ status: 409, description: 'Email ya utilizado' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Loguear' })
  @ApiResponse({ status: 201, description: 'Usuario logueado (retorna un token)' })
  @ApiResponse({ status: 400, description: 'Valores de email y password invalidos' })
  @ApiResponse({ status: 401, description: 'Email no existe o password incorrecto' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}