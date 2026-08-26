import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class AuthDatabaseService extends PrismaClient {

  constructor(protected readonly config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.getOrThrow<string>('TAVERN_AUTH_DB_URL'),
    });
    super({adapter})
  }
}