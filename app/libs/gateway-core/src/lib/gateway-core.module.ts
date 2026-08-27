import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientsModule,
  Transport,
  GrpcOptions,
} from '@nestjs/microservices';
import { workspaceRoot } from 'nx/src/utils/workspace-root';

const SERVICES: string[] = ['AUTH'];

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
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class OrgGatewayCoreModule {}
