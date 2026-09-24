import {
  Body,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from '@org/dto';
import { firstValueFrom } from 'rxjs';

import { HTTPController } from '../../decorators/controller.decorator';
import { SessionInputParam } from '../../decorators/session-input.decorator';
import { ValidateInputParam } from '../../decorators/validate-input.decorator';
import { Validate } from '../../decorators/validate.decorator';
import { CookieService } from '../../services/cookie.service';
import { GatewayMapService } from '../../services/map.service';

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
    private readonly map: GatewayMapService,
  ) {}

  onModuleInit(): void {
    this.authContract =
      this.client.getService<AuthServiceObservableContract>('AuthService');
  }

  @Post('register')
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

  @Post('login')
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

  @Post('refresh')
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

  @Post('logout')
  async logout(
    @SessionInputParam() session: SessionInput,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const refreshToken = this.cookie.getRefreshToken(req);
    await firstValueFrom(this.authContract.Logout({ refreshToken, session }));
    this.cookie.removeRefreshToken(res);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await firstValueFrom(this.authContract.ForgotPassword(dto))
  }

  @Post('reset-password/:token')
  async resetPassword(@Param('token') token: string, @SessionInputParam() session: SessionInput, @Body() dto: ResetPasswordDto): Promise<void> {
    await firstValueFrom(this.authContract.ResetPassword({token, session,...dto}))
  }

  @Get('me')
  @Validate()
  async me(
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<UserEntityGateway> {
    return this.map.mapUser(
      await firstValueFrom(this.authContract.GetMe(validation)),
    );
  }
}
