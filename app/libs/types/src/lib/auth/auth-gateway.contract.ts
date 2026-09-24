import { Observable } from 'rxjs';

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

export interface AuthServiceGateway {
  Register(data: RegisterInput): Observable<AuthOutput>;
  Login(data: LoginInput): Observable<AuthOutput>;
  Refresh(data: RefreshInput): Observable<AuthOutput>;
  Logout(data: RefreshInput): Observable<Empty>;
  Validate(data: ValidateInput): Observable<UserPayload>;
  ForgotPassword(data: ForgotPasswordInput): Observable<Empty>;
  ResetPassword(data: ResetPasswordInput): Observable<Empty>;
  GetMe(data: ValidateInput): Observable<UserEntity>;
}

export interface SessionServiceGateway {
  GetSessionsByUser(data: AllSessionsByUserInput): Observable<AllSessionsOutput>;
  GetMySessions(data: AllMySessionsInput): Observable<AllSessionsOutput>;
  ChangeSessionLocalName(data: SessionLocalNameInput): Observable<SessionOutput>;
  DeleteSessionById(data: DeleteSessionByIdInput): Observable<SessionOutput>;
  DeleteAllSessions(data: DeleteAllSessionsInput): Observable<Empty>;
}

export interface TokenServiceGateway {
  GetTokensWithPagination(data: GetTokensInput): Observable<AllTokensOutput>;
  GetTokenById(data: TokenByIdInput): Observable<TokenOutput>;
  SetTokenRevoked(data: RevokeTokenInput): Observable<TokenOutput>;
  DeleteTokenById(data: DeleteTokenInput): Observable<TokenOutput>;
  DeleteAllNotActiveTokens(data: DeleteAllNotActiveTokensInput): Observable<Empty>;
}

export interface UserServiceGateway {
  GetAllUsers(data: GetAllUsersInput): Observable<PaginatedUserOutput>;
  GetUserById(data: GetUserByIdInput): Observable<UserOutput>;
  BlockUser(data: BlockUserInput): Observable<UserOutput>;
  UnblockUser(data: UnblockUserInput): Observable<UserOutput>;
  PromoteToModerator(data: PromoteToModeratorInput): Observable<UserOutput>;
  DemoteFromModerator(data: DemoteFromModeratorInput): Observable<UserOutput>;
  ChangeEmail(data: ChangeEmailInput): Observable<UserOutput>;
  ChangePassword(data: ChangePasswordInput): Observable<UserOutput>;
  SetUserInactive(data: SetUserInactiveInput): Observable<Empty>;
  ChangeUserToActive(data: ChangeUserToActiveInput): Observable<UserOutput>;
}
