import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password } = dto;

    const userExists = await this.userRepository.findOneBy({ email });
    if (userExists) {
      this.logger.warn({ email: dto.email }, 'Usuario intentado registrar con correo existente');
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    this.logger.log({ userId: user.id }, 'Usuario creado exitosamente');
    return { message: 'Usuario registrado con éxito' };
  }

  async login(dto: LoginDto) {
    this.logger.log({ email: dto.email }, 'Intento de inicio de sesión');
    const { email, password } = dto;

    const user = await this.userRepository.findOneBy({ email });
    this.logger.warn({ email: dto.email }, 'Credenciales inválidas');
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    this.logger.warn({ email: dto.email }, 'Credenciales inválidas');
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    this.logger.log({ userId: user.id }, 'Sesión iniciada exitosamente');
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}