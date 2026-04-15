import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { Task } from './tasks/tasks.entity';
import { User } from './users/users.entity';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import environment from './config/environment';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environment],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        synchronize: config.get<boolean>('database.synchronize'),
        entities: [Task, User],
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const host = config.get<string>('cache.host');
        const port = config.get<number>('cache.port');
        return {
          stores: [
            await createKeyv(`redis://${host}:${port}`),
          ],
          ttl: 600000,
        };
      },
    }),
    AuthModule,
    TasksModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}