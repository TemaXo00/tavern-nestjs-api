import { ConsoleLogger, Injectable } from "@nestjs/common";

@Injectable()
export class LogsCoreService {
  private readonly logger = new ConsoleLogger('Test Logs');

  logMessage(payload: object): void {
    this.logger.log(JSON.stringify(payload))
  }
}
