import { BadRequestException, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthValidateService } from "@org/auth-core";
import { ValidateInput } from "@org/types";

@Injectable()
export class AuthJWTGuard extends AuthGuard('jwt') {
  constructor(private readonly validate: AuthValidateService) {
    super()
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context)

    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (typeof authHeader !== 'string') {
      throw new BadRequestException('Invalid type of auth header')
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing access token');
    }

    const accessToken = authHeader.replace('Bearer ', '')

    const validation: ValidateInput = {
      accessToken,
      session: {
        ip: request.ip,
        device: request.headers['x-device'] || 'Unknown',
        browser: request.headers['user-agent'] || 'Unknown',
        os: request.headers['x-os'] || 'Unknown',
      },
    };

    const payload = await this.validate.Validate(validation);
    request.user = payload;

    return true;
  }
}
