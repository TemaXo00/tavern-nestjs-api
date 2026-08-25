import { join } from "path";

import { ConsoleLogger, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { workspaceRoot } from "nx/src/utils/workspace-root";

import { MicroserviceBoostrapOptions } from "./types/microservice.type.js";

export async function microserviceLaunch<T>(options: MicroserviceBoostrapOptions<T>): Promise<void> {
    const APP_ENV_NAME = options.name.toUpperCase();
    const APP_LOCAL_NAME = options.name.toLowerCase();
    const LOGGER_NAME = `${APP_ENV_NAME} Microservice`
    const GRPC_PROTO_PATH = `proto/${APP_LOCAL_NAME}.proto`;
    const GRPC_PROTO_PACKAGE = APP_LOCAL_NAME;

    const app = await NestFactory.create(options.module, {
        logger: options.logs ?
            new ConsoleLogger({
                prefix: LOGGER_NAME,
                colors: true,
                compact: true,
                timestamp: false,
            }) : ['error', 'warn'],
    })

    const logger = new Logger()
    const config = app.get(ConfigService);

    const GLOBAL_SCOPE = config.get<string>('APPS_GLOBAL_SCOPE', 'EXAMPLE')
    const IS_DEV = config.get<string>(`${GLOBAL_SCOPE}_DEV_MODE`, 'false') === 'true';
    const PORT = config.get<number>(`${GLOBAL_SCOPE}_${APP_ENV_NAME}_GRPC_PORT`, 5000)

    const RMQ_URL = config.get<string>(`${GLOBAL_SCOPE}_RMQ_URL`, 'rabbitmq:5672')
    const RMQ_USER = config.get<string>(`${GLOBAL_SCOPE}_RMQ_USER`, 'user')
    const RMQ_PASSWORD = config.get<string>(`${GLOBAL_SCOPE}_RMQ_PASSWORD`, '123456')
    const RMQ_MESSAGE_TTL = config.get<number>(`${GLOBAL_SCOPE}_${APP_ENV_NAME}_RMQ_TTL`, 60000);
    const RMQ_MAX_LENGTH = config.get<number>(`${GLOBAL_SCOPE}_${APP_ENV_NAME}_RMQ_MAX_LENGTH`, 1000);

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            protoPath: join(workspaceRoot, GRPC_PROTO_PATH),
            package: GRPC_PROTO_PACKAGE,
            url: `0.0.0.0:${PORT}`
        }
    })

    if (options.rmq) {
        app.connectMicroservice<MicroserviceOptions>({
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://${RMQ_USER}:${RMQ_PASSWORD}@${RMQ_URL}`],
                queue: APP_LOCAL_NAME,
                noAck: false,
                prefetchCount: 10,
                queueOptions: {
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: {
                        'x-message-ttl': RMQ_MESSAGE_TTL,
                        'x-max-length': RMQ_MAX_LENGTH,
                        'x-dead-letter-exchange': `${APP_LOCAL_NAME}.dlx`
                    }
                }
            }
        })
    }

    if (IS_DEV) {
        logger.log(`${LOGGER_NAME} started in DEV Mode`);
        logger.log(`Global scope of applications: ${GLOBAL_SCOPE}. Using for configure ENV variables`);
        logger.log(`To disable DEV mode, remove or set 'false' variable ${GLOBAL_SCOPE}_DEV_MODE`);
        logger.log('');

        logger.log(`gRPC URL: 0.0.0.0:${PORT}`);
        logger.log(`gRPC Proto path: ${GRPC_PROTO_PATH}`);
        logger.log(`gRPC Package: ${GRPC_PROTO_PACKAGE}`);
        if (options.rmq) {
            logger.log(`RabbitMQ URL: amqp://${RMQ_USER}:****@${RMQ_URL}`);
            logger.log(`RabbitMQ Queue: ${APP_LOCAL_NAME}`);
            logger.log(`RabbitMQ Durable: true`);
            logger.log(`RabbitMQ Prefetch: 10`);
            logger.log(`RabbitMQ TTL: ${RMQ_MESSAGE_TTL}ms`);
            logger.log(`RabbitMQ Max Length: ${RMQ_MAX_LENGTH}`);
        }
        logger.log('');

        logger.log(`Logging status: ${options.logs ? 'enabled' : 'disabled'}`);
        logger.log(`RMQ status: ${options.rmq ? 'enabled' : 'disabled'}`);
        logger.log('');

        logger.log('To configure Bootstrap, use next variables:');
        logger.log('APPS_GLOBAL_SCOPE - Global name. Used for ENV variables');
        logger.log(`${GLOBAL_SCOPE}_DEV_MODE - DEV mode. Accepts "true" or "false"`);
        logger.log(`${GLOBAL_SCOPE}_${APP_ENV_NAME}_GRPC_PORT - gRPC Port. Default: 5000`);
        if (options.rmq) {
            logger.log(`${GLOBAL_SCOPE}_RMQ_URL - RabbitMQ URL. Default: rabbitmq:5672`);
            logger.log(`${GLOBAL_SCOPE}_RMQ_USER - RabbitMQ User. Default: user`);
            logger.log(`${GLOBAL_SCOPE}_RMQ_PASSWORD - RabbitMQ Password. Default: 123456`);
            logger.log(`${GLOBAL_SCOPE}_${APP_ENV_NAME}_RMQ_TTL - Message TTL in ms. Default: 60000`);
            logger.log(`${GLOBAL_SCOPE}_${APP_ENV_NAME}_RMQ_MAX_LENGTH - Max queue length. Default: 1000`);
        }
        logger.log('');
    }

    process.on('SIGTERM', async () => {
        logger.log('Received SIGTERM, shutting down...');
        await app.close();
        process.exit(0);
    });

    process.on('SIGINT', async () => {
        logger.log('Received SIGINT, shutting down...');
        await app.close();
        process.exit(0);
    });

    try {
        await app.startAllMicroservices()
        logger.log(`${LOGGER_NAME} successfully started`);
    }
    catch (error) {
        logger.error('Failed to start')
        logger.error(error);
        process.exit(1);
    }
}