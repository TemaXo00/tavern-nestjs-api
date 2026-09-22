import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

import {
  AUTHOR_GITHUB,
  AUTHOR_MAIL,
  AUTHOR_NAME,
  SWAGGER_PATH,
} from './info.config.js';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API')
  .setContact(AUTHOR_NAME, AUTHOR_GITHUB, AUTHOR_MAIL)
  .build();

export const swaggerUIConfig: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
    filter: true,
    displayRequestDuration: true,
    operationsSorter: (
      a: { get: (arg0: string) => string },
      b: { get: (arg0: string) => string },
    ) => {
      const methodOrder: Record<string, number> = {
        get: 1,
        post: 2,
        put: 3,
        patch: 4,
        delete: 5,
        head: 6,
        options: 7,
        trace: 8,
      };
      const methodA = a.get('method').toLowerCase();
      const methodB = b.get('method').toLowerCase();

      return (methodOrder[methodA] || 99) - (methodOrder[methodB] || 99);
    },
    tagsSorter: 'alpha',
    tryItOutEnabled: true,
    requestSnippetsEnabled: true,
    syntaxHighlight: {
      activated: true,
      theme: 'monokai',
    },
    displayOperationId: true,
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
    showExtensions: true,
    showCommonExtensions: true,
    deepLinking: true,
    validatorUrl: null,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
  },
  customSiteTitle: 'API',
  customCss: `
    .swagger-ui .topbar {display: none !important;}
    `,
  jsonDocumentUrl: `${SWAGGER_PATH}/swagger.json`,
  yamlDocumentUrl: `${SWAGGER_PATH}/swagger.yaml`,
};
