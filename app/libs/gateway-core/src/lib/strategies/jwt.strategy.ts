import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserPayload } from '@org/types';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('TAVERN_JWT_SECRET'),
    });
  }

  validate(payload: UserPayload): UserPayload {
    return {
      id: payload.id,
      sessionId: payload.sessionId,
      role: payload.role,
    };
  }
}
