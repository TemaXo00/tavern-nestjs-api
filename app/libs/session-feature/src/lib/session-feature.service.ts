import { Injectable } from "@nestjs/common";
import { AuthValidateService } from "@org/auth-feature";
import { AuthCacheUtil, AuthDatabaseUtil, AuthMessagesUtil, AuthValidateUtil } from "@org/auth-utils";
import { AllMySessions, AllSessionsByUserInput, AllSessionsOutput, DeleteAllSessionsInput, DeleteSessionByIdInput, Empty, Roles, SessionLocalNameInput, SessionOutput, SessionServiceContract } from "@org/types";

@Injectable()
export class SessionFeatureService implements SessionServiceContract {
  constructor(
    private readonly validation: AuthValidateService,
    private readonly dbUtil: AuthDatabaseUtil,
    private readonly validateUtil: AuthValidateUtil,
    private readonly messagesUtil: AuthMessagesUtil,
    private readonly cacheUtil: AuthCacheUtil
  ) {}

  async GetSessionsByUser(data: AllSessionsByUserInput): Promise<AllSessionsOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [Roles.ADMIN])
    await this.validateUtil.validateUserExists(data.userId)
    const sessions = await this.dbUtil.getAllSessionsByUser(data.userId)
    this.messagesUtil.sendAdminCheckUserSessions({userId: data.userId, adminId: payload.id})
    return { sessions: sessions }
  }

  async GetMySessions(data: AllMySessions): Promise<AllSessionsOutput> {
    const payload = await this.validation.Validate(data.validation)
    const sessions = await this.dbUtil.getAllSessionsByUser(payload.id)
    return { sessions: sessions }
  }

  async ChangeSessionLocalName(data: SessionLocalNameInput): Promise<SessionOutput> {
    const payload = await this.validation.Validate(data.validation)
    this.messagesUtil.sendUserChangeLocalSessionName({userId: payload.id, sessionId: payload.sessionId})
    return await this.dbUtil.updateSessionLocalname(payload.sessionId, data.localName)
  }

  async DeleteSessionById(data: DeleteSessionByIdInput): Promise<SessionOutput> {
    const payload = await this.validation.Validate(data.validation)
    this.validateUtil.validateNotCurrentSession(payload.sessionId, data.sessionId)
    const session = await this.validateUtil.validateSessionExists(data.sessionId)
    this.validateUtil.validateSessionOnCurrentUser(payload.id, session.userId)
    await this.cacheUtil.delPayload(payload.id, payload.sessionId)
    this.messagesUtil.sendUserDeleteSession({ userId: payload.id, sessionId: data.sessionId })
    return await this.dbUtil.removeSession(data.sessionId)
  }

  async DeleteAllSessions(data: DeleteAllSessionsInput): Promise<Empty> {
    const payload = await this.validation.Validate(data.validation)
    await this.dbUtil.removeAllSessions(payload.id)
    await this.cacheUtil.delAllPayloads(payload.id)
    this.messagesUtil.sendUserDeleteAllSessions({ userId: payload.id })
    return {}
  }
}
