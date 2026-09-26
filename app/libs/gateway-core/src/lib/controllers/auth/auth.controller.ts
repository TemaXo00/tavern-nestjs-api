import { Body, Inject, OnModuleInit, Param, Req, Res } from '@nestjs/common';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from '@org/dto';
import { firstValueFrom } from 'rxjs';

import { HTTPController } from '../../decorators/controller.decorator';
import { GETProtectedMethod } from '../../decorators/methods/get-method.decorator';
import { POSTMethod } from '../../decorators/methods/post-method.decorator';
import { SessionInputParam } from '../../decorators/session-input.decorator';
import { ValidateInputParam } from '../../decorators/validate-input.decorator';
import { CookieService } from '../../services/cookie.service';
import { AuthGatewayMapService } from '../../services/map/auth-map.service';

import type { ClientGrpc } from '@nestjs/microservices';
import type {
  AuthGatewayOutput,
  AuthServiceObservableContract,
  SessionInput,
  UserEntityGateway,
  ValidateInput,
} from '@org/types';
import type { Request, Response } from 'express';

@HTTPController({ microserviceName: 'Auth', serviceName: 'Authorization' })
export class AuthController implements OnModuleInit {
  private authContract!: AuthServiceObservableContract;

  constructor(
    @Inject('AUTH_CLIENT') private readonly client: ClientGrpc,
    private readonly cookie: CookieService,
    private readonly map: AuthGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.authContract =
      this.client.getService<AuthServiceObservableContract>('AuthService');
  }

  @POSTMethod({
    path: 'register',
    operationDesc:
      'Registration method for user. Create new user, session, JWt tokens',
  })
  async register(
    @Body() dto: RegisterDto,
    @SessionInputParam() session: SessionInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthGatewayOutput> {
    const response = await firstValueFrom(
      this.authContract.Register({ session, ...dto }),
    );
    this.cookie.setRefreshToken(res, response.refreshToken);
    return { accessToken: response.accessToken };
  }

  @POSTMethod({
    path: 'login',
    operationDesc: 'Login method for user. Create new session, JWt tokens',
  })
  async login(
    @Body() dto: LoginDto,
    @SessionInputParam() session: SessionInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthGatewayOutput> {
    const response = await firstValueFrom(
      this.authContract.Login({ session, ...dto }),
    );
    this.cookie.setRefreshToken(res, response.refreshToken);
    return { accessToken: response.accessToken };
  }

  @POSTMethod({
    path: 'refresh',
    operationDesc: 'Refresh method by using refresh token',
  })
  async refresh(
    @SessionInputParam() session: SessionInput,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<AuthGatewayOutput> {
    const refreshToken = this.cookie.getRefreshToken(req);
    try {
      const response = await firstValueFrom(
        this.authContract.Refresh({ refreshToken, session }),
      );
      this.cookie.setRefreshToken(res, response.refreshToken);
      return { accessToken: response.accessToken };
    } catch (err: unknown) {
      this.cookie.removeRefreshToken(res);
      throw err;
    }
  }

  @POSTMethod({
    path: 'logout',
    operationDesc: 'Logout from application. Destroy session and JWT Tokens',
  })
  async logout(
    @SessionInputParam() session: SessionInput,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const refreshToken = this.cookie.getRefreshToken(req);
    await firstValueFrom(this.authContract.Logout({ refreshToken, session }));
    this.cookie.removeRefreshToken(res);
  }

  @POSTMethod({
    path: 'forgot-password',
    operationDesc: 'Using for forgotted passwords. Sends email if user exists',
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await firstValueFrom(this.authContract.ForgotPassword(dto));
  }

  @POSTMethod({
    path: 'reset-password/:token',
    operationDesc:
      'Reset your current password. Destroys all sessions of current user',
  })
  async resetPassword(
    @Param('token') token: string,
    @SessionInputParam() session: SessionInput,
    @Body() dto: ResetPasswordDto,
  ): Promise<void> {
    await firstValueFrom(
      this.authContract.ResetPassword({ token, session, ...dto }),
    );
  }

  @GETProtectedMethod({
    path: 'me',
    operationDesc: 'Get current user entity by typing Access Token',
  })
  async me(
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<UserEntityGateway> {
    return this.map.mapUserEntity(
      await firstValueFrom(this.authContract.GetMe(validation)),
    );
  }
}
