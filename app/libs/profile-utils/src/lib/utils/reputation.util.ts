import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { Actions } from '@org/profile-database';

@Injectable()
export class ProfileReputationUtil {
  private readonly scores: Record<Actions, number>;

  constructor(private readonly config: ConfigService) {
    this.scores = {
      EVENT: this.config.get<number>('TAVERN_REPUTATION_SCORE_EVENT', 60),
      BLOCK: this.config.get<number>('TAVERN_REPUTATION_SCORE_BLOCK', -50),
      EARLY_UNBLOCK: this.config.get<number>(
        'TAVERN_REPUTATION_SCORE_EARLY_UNBLOCK',
        50,
      ),
      FRIENDSHIP: this.config.get<number>(
        'TAVERN_REPUTATION_SCORE_FRIENDSHIP',
        10,
      ),
      REPORT: this.config.get<number>('TAVERN_REPUTATION_SCORE_REPORT', -10),
    };
  }

  getScore(type: Actions): number {
    const score = this.scores[type];
    if (score === undefined) {
      throw new RpcException({
        message: `Unknown action type: ${type}`,
        code: status.INVALID_ARGUMENT,
      });
    }
    return score;
  }
}
