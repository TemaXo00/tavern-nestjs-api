import { Inject, OnModuleInit } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { HTTPController } from '../../decorators/controller.decorator';
import { GETProtectedMethod } from '../../decorators/methods/get-method.decorator';
import { ValidateInputParam } from '../../decorators/validate-input.decorator';

import type { ClientGrpc } from '@nestjs/microservices';
import type {
  AllSessionsOutput,
  SessionServiceObservableContract,
  ValidateInput,
} from '@org/types';

@HTTPController({ serviceName: 'Session', microserviceName: 'Auth' })
export class SessionController implements OnModuleInit {
  private sessionContract!: SessionServiceObservableContract;

  constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.sessionContract =
      this.client.getService<SessionServiceObservableContract>(
        'SessionService',
      );
  }

  @GETProtectedMethod({
    path: 'my',
    operationDesc: 'Get all sessions by current user',
  })
  async getMySessions(
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<AllSessionsOutput> {
    return await firstValueFrom(
      this.sessionContract.GetMySessions({ validation }),
    );
  }
}
