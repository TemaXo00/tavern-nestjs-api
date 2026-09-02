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
import { AllMySessions, AllSessionsByUserInput, DeleteAllSessionsInput, DeleteSessionByIdInput, SessionLocalNameInput } from './session/session-input.data.js';
import { AllSessionsOutput, SessionOutput } from './session/session-output.data.js';

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
  GetSessionByUser(data: AllSessionsByUserInput): Promise<AllSessionsOutput>
  GetMySession(data: AllMySessions): Promise<AllSessionsOutput>
  ChangeSessionLocalName(data: SessionLocalNameInput): Promise<SessionOutput>
  DeleteSessionById(data: DeleteSessionByIdInput): Promise<SessionOutput>
  DeleteAllSessions(data: DeleteAllSessionsInput): Promise<Empty>
}
