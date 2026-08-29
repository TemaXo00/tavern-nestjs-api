import { Injectable } from "@nestjs/common";
import * as argon2 from 'argon2'

@Injectable()
export class AuthPasswordUtil {
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      timeCost: 3,
      memoryCost: 65536,
      parallelism: 4,
      type: argon2.argon2id
    })
  }
}
