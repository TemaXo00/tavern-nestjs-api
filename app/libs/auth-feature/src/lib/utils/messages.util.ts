import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AuthCreatedMessage } from "@org/types";

@Injectable()
export class AuthMessagesUtil {
  constructor(
    @Inject('PROFILE_CLIENT') private readonly profile: ClientProxy
  ) {}

  sendProfileCreatedMessage(data: AuthCreatedMessage): void {
    this.profile.emit('user.created', data)
  }
}
