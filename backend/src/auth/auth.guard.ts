import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const path = request.url;
    const method = request.method;

    if (!token) {
      this.logger.warn({ path, method }, 'Acceso denegado: Token ausente');
      throw new UnauthorizedException('Authentication token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('app.secret'),
      });
      
      this.logger.log({ userId: payload.sub, path }, 'Token JWT validado correctamente');

      request['user'] = payload;
    } catch(error) {
      this.logger.error(
        { path, errorMessage: error.message }, 
        'Acceso denegado: Token inválido o expirado'
      );
      throw new UnauthorizedException('Authentication token has been invalidated or has expired');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}