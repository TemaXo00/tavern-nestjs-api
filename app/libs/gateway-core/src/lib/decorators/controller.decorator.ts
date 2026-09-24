import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

interface IControllerOptions {
  microserviceName: string;
  serviceName: string;
}

export function HTTPController(options: IControllerOptions): ClassDecorator {
  const tag = `${options.microserviceName.toUpperCase()} / ${options.serviceName}`;
  const path = `${options.microserviceName.toLowerCase()}/${options.serviceName.toLowerCase()}`;

  return applyDecorators(
    ApiTags(tag),
    Controller(path),
  );
}
