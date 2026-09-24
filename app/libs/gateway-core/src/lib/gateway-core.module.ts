import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport, GrpcOptions } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport'
import { workspaceRoot } from 'nx/src/utils/workspace-root';

import { AuthController } from './controllers/auth/auth.controller';
import { AuthJWTGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { CookieService } from './services/cookie.service';
import { JwtStrategy } from './strategies/jwt.strategy';

const SERVICES: string[] = ['AUTH'];

const AUTH_CONTROLLERS = [
  AuthController
]

@Module({
  imports: [
    ClientsModule.registerAsync(
      SERVICES.map((service) => ({
        name: `${service}_CLIENT`,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService): GrpcOptions => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>(
              `TAVERN_${service}_GRPC_URL`,
              `${service.toLowerCase()}-service:5000`,
            ),
            package: service.toLowerCase(),
            protoPath: join(
              workspaceRoot,
              `proto/${service.toLowerCase()}.proto`,
            ),
          },
        }),
        inject: [ConfigService],
      })),
    ),
    ConfigModule,
    PassportModule
  ],
  controllers: [
    ...AUTH_CONTROLLERS
  ],
  providers: [
    JwtStrategy,
    AuthJWTGuard,
    RolesGuard,
    CookieService
  ],
  exports: [],
})
export class OrgGatewayCoreModule {}
