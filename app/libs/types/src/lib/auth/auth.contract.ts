import {
  ForgotPasswordInput,
  LoginInput,
  RefreshInput,
  RegisterInput,
  ResetPasswordInput,
} from './authorization/auth-input.data.js';
import { AuthOutput } from './authorization/auth-output.data.js';
import { Empty } from '../shared/empty.type.js';
import { UserEntity, UserPayload } from './authorization/auth.entity.js';
import {
  AllMySessionsInput,
  AllSessionsByUserInput,
  DeleteAllSessionsInput,
  DeleteSessionByIdInput,
  SessionLocalNameInput,
} from './session/session-input.data.js';
import {
  AllSessionsOutput,
  SessionOutput,
} from './session/session-output.data.js';
import {
  DeleteAllNotActiveTokensInput,
  DeleteTokenInput,
  GetTokensInput,
  RevokeTokenInput,
  TokenByIdInput,
} from './token/token-input.data.js';
import { AllTokensOutput, TokenOutput } from './token/token-output.data.js';
import { ValidateInput } from '../shared/validation.type.js';
import {
  BlockUserInput,
  ChangeEmailInput,
  ChangePasswordInput,
  ChangeUserToActiveInput,
  DemoteFromModeratorInput,
  GetAllUsersInput,
  GetUserByIdInput,
  PromoteToModeratorInput,
  SetUserInactiveInput,
  UnblockUserInput,
} from './user/user-input.data.js';
import { PaginatedUserOutput, UserOutput } from './user/user-output.data.js';
import { ToObservable } from '../utils/grpc-to-observable.js';

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
  GetSessionsByUser(data: AllSessionsByUserInput): Promise<AllSessionsOutput>;
  GetMySessions(data: AllMySessionsInput): Promise<AllSessionsOutput>;
  ChangeSessionLocalName(data: SessionLocalNameInput): Promise<SessionOutput>;
  DeleteSessionById(data: DeleteSessionByIdInput): Promise<SessionOutput>;
  DeleteAllSessions(data: DeleteAllSessionsInput): Promise<Empty>;
}

export interface TokenServiceContract {
  GetTokensWithPagination(data: GetTokensInput): Promise<AllTokensOutput>;
  GetTokenById(data: TokenByIdInput): Promise<TokenOutput>;
  SetTokenRevoked(data: RevokeTokenInput): Promise<TokenOutput>;
  DeleteTokenById(data: DeleteTokenInput): Promise<TokenOutput>;
  DeleteAllNotActiveTokens(data: DeleteAllNotActiveTokensInput): Promise<Empty>;
}

export interface UserServiceContract {
  GetAllUsers(data: GetAllUsersInput): Promise<PaginatedUserOutput>;
  GetUserById(data: GetUserByIdInput): Promise<UserOutput>;
  BlockUser(data: BlockUserInput): Promise<UserOutput>;
  UnblockUser(data: UnblockUserInput): Promise<UserOutput>;
  PromoteToModerator(data: PromoteToModeratorInput): Promise<UserOutput>;
  DemoteFromModerator(data: DemoteFromModeratorInput): Promise<UserOutput>;
  ChangeEmail(data: ChangeEmailInput): Promise<UserOutput>;
  ChangePassword(data: ChangePasswordInput): Promise<UserOutput>;
  SetUserInactive(data: SetUserInactiveInput): Promise<Empty>;
  ChangeUserToActive(data: ChangeUserToActiveInput): Promise<UserOutput>;
}

export type AuthServiceObservableContract = ToObservable<AuthServiceContract>
export type SessionServiceObservableContract = ToObservable<SessionServiceContract>
export type TokenServiceObservableContract = ToObservable<TokenServiceContract>
export type UserServiceObservableContract = ToObservable<UserServiceContract>
