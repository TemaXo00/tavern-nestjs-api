import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class CookieService {
  private REFRESH_TOKEN_TTL: number;
  private DEV_MODE: boolean;

  constructor(private readonly config: ConfigService) {
    this.REFRESH_TOKEN_TTL = Number(
      this.config.get('TAVERN_JWT_REFRESH_TOKEN_TTL', 30),
    );
    this.DEV_MODE =
      this.config.get<string>(`TAVERN_DEV_MODE`, 'false') === 'true';
  }

  setRefreshToken(res: Response, token: string): void {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.REFRESH_TOKEN_TTL);

    res.cookie('refreshToken', token, {
      expires: expiresIn,
      sameSite: 'lax',
      httpOnly: true,
      secure: !this.DEV_MODE,
    });
  }

  removeRefreshToken(res: Response): void {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: !this.DEV_MODE,
      sameSite: 'lax',
    });
  }

  getRefreshToken(req: Request): string {
    const token = req.cookies['refreshToken'];

    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    return token;
  }
}
