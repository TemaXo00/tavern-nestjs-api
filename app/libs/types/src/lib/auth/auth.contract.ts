import {
  ForgotPasswordInput,
  LoginInput,
  RefreshInput,
  RegisterInput,
  ResetPasswordInput,
  ValidateInput,
} from './authorization/auth-input.data.js';
import { AuthOutput } from './authorization/auth-output.data.js';
import { Empty } from '../shared/empty.type.js';
import { UserEntity, UserPayload } from './authorization/auth.entity.js';
import { AllMySessionsInput, AllSessionsByUserInput, DeleteAllSessionsInput, DeleteSessionByIdInput, SessionLocalNameInput } from './session/session-input.data.js';
import { AllSessionsOutput, SessionOutput } from './session/session-output.data.js';
import { DeleteAllNotActiveTokensInput, DeleteTokenInput, GetTokensInput, RevokeTokenInput, TokenByIdInput } from './token/token-input.data.js';
import { AllTokensOutput, TokenOutput } from './token/token-output.data.js';

export interface AuthServiceContract {
  Register(data: RegisterInput): Promise<AuthOutput>;
  Login(data: LoginInput): Promise<AuthOutput>;
  Refresh(data: RefreshInput): Promise<AuthOutput>;
  Logout(data: RefreshInput): Promise<Empty>;
  Validate(data: ValidateInput): Promise<UserPayload>;
  ForgotPassword(data: ForgotPasswordInput): Promise<Empty>;
  ResetPassword(data: ResetPasswordInput): Promise<Empty>;
  GetMe(data: ValidateInput): Promise<UserEntity>;
}

export interface SessionServiceContract {
  GetSessionsByUser(data: AllSessionsByUserInput): Promise<AllSessionsOutput>
  GetMySessions(data: AllMySessionsInput): Promise<AllSessionsOutput>
  ChangeSessionLocalName(data: SessionLocalNameInput): Promise<SessionOutput>
  DeleteSessionById(data: DeleteSessionByIdInput): Promise<SessionOutput>
  DeleteAllSessions(data: DeleteAllSessionsInput): Promise<Empty>
}

export interface TokenServiceContract {
  GetTokensWithPagination(data: GetTokensInput): Promise<AllTokensOutput>
  GetTokenById(data: TokenByIdInput): Promise<TokenOutput>
  SetTokenRevoked(data: RevokeTokenInput): Promise<TokenOutput>
  DeleteTokenById(data: DeleteTokenInput): Promise<TokenOutput>
  DeleteAllNotActiveTokens(data: DeleteAllNotActiveTokensInput): Promise<Empty>
}
