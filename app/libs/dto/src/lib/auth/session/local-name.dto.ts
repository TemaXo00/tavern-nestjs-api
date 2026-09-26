import { LocalName } from '../../decorators/auth/local-name.decorator.js';

import type { SessionLocalNameGateway } from '@org/types';

export class LocalNameDto implements SessionLocalNameGateway {
  @LocalName()
  localName: string;
}
