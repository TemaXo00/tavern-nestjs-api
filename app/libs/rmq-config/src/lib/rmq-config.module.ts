import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RmqService } from './rmq-config.service';

@Module({
  imports: [ConfigModule],
  providers: [RmqService],
  exports: [RmqService]
})
export class RmqModule {}
