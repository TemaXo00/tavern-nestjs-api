import { ConsoleLogger, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import compression = require("compression");
import rateLimit from "express-rate-limit";

import { corsConfig } from "./configurations/cors.config.js";
import { SWAGGER_PATH } from "./configurations/info.config.js";
import { swaggerConfig, swaggerUIConfig } from "./configurations/swagger.config.js";
import { validationPipeConfig } from "./configurations/validation-pipe.config.js";
import { GatewayBootstrapOptions } from "./types/gateway.type.js";
import { AllExceptionsFilter } from "./utils/filters/exception.filter.js";
import { ResponseInterceptor } from "./utils/interceptors/response.interceptor.js";
import { loggingMiddleware } from "./utils/middlewares/logging.middleware.js";

export async function gatewayLaunch<T>(options: GatewayBootstrapOptions<T>): Promise<void> {
    const APP_PREFIX = 'API Gateway';

    const app = await NestFactory.create(options.module, {
        logger: options.logs ?
            new ConsoleLogger({
                prefix: APP_PREFIX,
                colors: true,
                compact: true,
                timestamp: false,
            }) : ['error', 'warn'],
    })

    if (options.globalPrefix) {
        app.setGlobalPrefix(options.globalPrefix);
    }

    const logger = new Logger()
    const config = app.get(ConfigService);

    const GLOBAL_SCOPE = config.get<string>('APPS_GLOBAL_SCOPE', 'EXAMPLE')
    const IS_DEV = config.get<string>(`${GLOBAL_SCOPE}_DEV_MODE`, 'false') === 'true';
    const PORT = config.get<number>(`${GLOBAL_SCOPE}_GATEWAY_PORT`, 3000)
    const WINDOW_MS = config.get<number>(`${GLOBAL_SCOPE}_WINDOW_MS_MINUTES`, 15)
    const REQUEST_LIMIT = config.get<number>(`${GLOBAL_SCOPE}_REQUEST_LIMIT`, 1000)
    const ALLOWED_ORIGIN = config.get<string>(`${GLOBAL_SCOPE}_ALLOWED_ORIGIN`, 'example.com')

    if (options.logs) {
        app.use(loggingMiddleware)
    }

    if (options.interceptors) {
        app.useGlobalInterceptors(new ResponseInterceptor());
    }

    if (options.filters) {
        app.useGlobalFilters(new AllExceptionsFilter());
    }

    if (options.validation) {
        app.useGlobalPipes(
            new ValidationPipe(validationPipeConfig),
        );
    }

    if (options.cors) {
        app.enableCors({
            allowedOrigins: ALLOWED_ORIGIN,
            ...corsConfig
        });
    }

    if (options.swagger) {
        const swaggerDocument: OpenAPIObject = SwaggerModule.createDocument(
            app,
            swaggerConfig,
        );
        SwaggerModule.setup(SWAGGER_PATH, app, swaggerDocument, swaggerUIConfig);
    }

    if (options.rateLimit) {
        app.use(
            rateLimit({
                windowMs: WINDOW_MS * 60 * 1000,
                limit: REQUEST_LIMIT,
                message: 'Too many requests from this IP',
            }),
        );
    }

    if (options.compression) {
        app.use(compression())
    }

    if (IS_DEV) {
        logger.log('API Gateway started in DEV Mode')
        logger.log(`Global scope of applications: ${GLOBAL_SCOPE}. Using for configure ENV variables`);
        logger.log(`To disable DEV mode, remove or set 'false' variable ${GLOBAL_SCOPE}_DEV_MODE`);
        logger.log('')

        logger.log(`Application URL: http://localhost:${PORT}`)
        logger.log(`Application global prefix: ${options.globalPrefix}`)
        logger.log(`CORS Origin: ${ALLOWED_ORIGIN}`)
        logger.log(`Swagger documentation: ${options.swagger ? `enabled. Path: http://localhost:${PORT}/${SWAGGER_PATH}` : 'disabled'}`)
        logger.log('')

        logger.log(`Logging status: ${options.logs ? 'enabled' : 'disabled'}`);
        logger.log(`Validation status: ${options.validation ? 'enabled' : 'disabled'}`);
        logger.log(`Interceptors status: ${options.interceptors ? 'enabled' : 'disabled'}`);
        logger.log(`Filters status: ${options.filters ? 'enabled' : 'disabled'}`);
        logger.log('')

        logger.log(`Compression status: ${options.compression ? 'enabled' : 'disabled'}`);
        logger.log(`Rate limit status: ${options.rateLimit ? 'enabled' : 'disabled'}`);
        if (options.rateLimit) {
            logger.log(`Window: ${WINDOW_MS} minutes`)
            logger.log(`Limit: ${REQUEST_LIMIT}`)
        }
        logger.log('')

        logger.log('To configure Bootstrap, use next variables:')
        logger.log('APPS_GLOBAL_SCOPE - Global name. Used for ENV variables');
        logger.log(`${GLOBAL_SCOPE}_DEV_MODE - DEV mode. Accepts "true" or "false"`);
        logger.log(`${GLOBAL_SCOPE}_GATEWAY_PORT - HTTP Port. Default: 3000`);
        logger.log(`${GLOBAL_SCOPE}_WINDOW_MS_MINUTES - Rate limit window in minutes. Default: 15`);
        logger.log(`${GLOBAL_SCOPE}_REQUEST_LIMIT - Rate limit requests per window. Default: 1000`);
        logger.log(`${GLOBAL_SCOPE}_ALLOWED_ORIGIN - CORS allowed origin. Default: example.com`);
        logger.log('')
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
        await app.listen(PORT)
        logger.log('API Gateway started successfully');
    }
    catch (error) {
        logger.error('Failed to start')
        logger.error(error);
        process.exit(1);
    }
}