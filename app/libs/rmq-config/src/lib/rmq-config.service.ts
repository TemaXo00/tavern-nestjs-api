import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly config: ConfigService) { }

  private getRmqUrl(): string {
    const rmqUser = this.config.get<string>('TAVERN_RMQ_USER', 'user')
    const rmqPassword = this.config.get<string>('TAVERN_RMQ_PASSWORD', '123456')
    const rmqUrl = this.config.get<string>('TAVERN_RMQ_URL', 'rabbitmq:5672')

    return `amqp://${rmqUser}:${rmqPassword}@${rmqUrl}`
  }

  getRmqConfig(queue: string): ClientProviderOptions {
    return {
      name: `${queue.toUpperCase()}_CLIENT`,
      transport: Transport.RMQ,
      options: {
        urls: [this.getRmqUrl()],
        queue,
        noAck: false,
        prefetchCount: 10,
        queueOptions: {
          durable: true,
        },
      }
    }
  }
}
