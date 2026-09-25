import { Body, Inject, OnModuleInit, Param } from '@nestjs/common';
import { LocalNameDto } from '@org/dto';
import {
  Roles,
  type SessionOutput,
  type AllSessionsOutput,
  type SessionServiceObservableContract,
  type ValidateInput,
} from '@org/types';
import { firstValueFrom } from 'rxjs';

import { HTTPController } from '../../decorators/controller.decorator';
import { DELETEProtectedMethod } from '../../decorators/methods/delete-method.decorator';
import { GETProtectedMethod } from '../../decorators/methods/get-method.decorator';
import { PATCHProtectedMethod } from '../../decorators/methods/patch-method.decorator';
import { ValidateInputParam } from '../../decorators/validate-input.decorator';

import type { ClientGrpc } from '@nestjs/microservices';

@HTTPController({ serviceName: 'Session', microserviceName: 'Auth' })
export class SessionController implements OnModuleInit {
  private sessionContract!: SessionServiceObservableContract;

  constructor(@Inject('AUTH_CLIENT') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.sessionContract =
      this.client.getService<SessionServiceObservableContract>(
        'SessionService',
      );
  }

  @GETProtectedMethod({
    path: 'user/:id',
    operationDesc: 'Admin method to check user sessions',
    roles: [Roles.ADMIN],
  })
  async getSessionsByUser(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') userId: string,
  ): Promise<AllSessionsOutput> {
    return await firstValueFrom(
      this.sessionContract.GetSessionsByUser({ validation, userId }),
    );
  }

  @GETProtectedMethod({
    path: 'me',
    operationDesc: 'Get all sessions by current user',
  })
  async getMySessions(
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<AllSessionsOutput> {
    return await firstValueFrom(
      this.sessionContract.GetMySessions({ validation }),
    );
  }

  @PATCHProtectedMethod({
    path: 'me/local-name',
    operationDesc: 'Updating current user session local name',
  })
  async updateLocalName(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: LocalNameDto,
  ): Promise<SessionOutput> {
    return await firstValueFrom(
      this.sessionContract.ChangeSessionLocalName({
        validation,
        localName: dto.localName,
      }),
    );
  }

  @DELETEProtectedMethod({
    path: 'me/session/:id',
    operationDesc: 'Delete session by id',
  })
  async deleteSessionById(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') sessionId: string,
  ): Promise<SessionOutput> {
    return await firstValueFrom(
      this.sessionContract.DeleteSessionById({ validation, sessionId }),
    );
  }

  @DELETEProtectedMethod({
    path: 'me/session',
    operationDesc: 'Delete all sessions from current user, exclude current',
    noContent: true,
  })
  async deleteAllSessions(
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<void> {
    await firstValueFrom(
      this.sessionContract.DeleteAllSessions({ validation }),
    );
  }
}
