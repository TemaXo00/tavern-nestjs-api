import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { SessionFeatureService } from "./session-feature.service";

import type { AllMySessions, AllSessionsByUserInput, AllSessionsOutput, DeleteAllSessionsInput, DeleteSessionByIdInput, Empty, SessionLocalNameInput, SessionOutput, SessionServiceContract } from "@org/types";

@Controller()
export class SessionFeatureController implements SessionServiceContract {
  constructor(private readonly service: SessionFeatureService) { }

  @GrpcMethod('SessionService', 'GetSessionsByUser')
  async GetSessionsByUser(data: AllSessionsByUserInput): Promise<AllSessionsOutput> {
    return await this.service.GetSessionsByUser(data)
  }

  @GrpcMethod('SessionService', 'GetMySessions')
  async GetMySessions(data: AllMySessions): Promise<AllSessionsOutput> {
    return await this.service.GetMySessions(data)
  }

  @GrpcMethod('SessionService', 'ChangeSessionLocalName')
  async ChangeSessionLocalName(data: SessionLocalNameInput): Promise<SessionOutput> {
    return await this.service.ChangeSessionLocalName(data)
  }

  @GrpcMethod('SessionService', 'DeleteSessionById')
  async DeleteSessionById(data: DeleteSessionByIdInput): Promise<SessionOutput> {
    return await this.service.DeleteSessionById(data)
  }

  @GrpcMethod('SessionService', 'DeleteAllSessions')
  async DeleteAllSessions(data: DeleteAllSessionsInput): Promise<Empty> {
    return await this.service.DeleteAllSessions(data)
  }
}
