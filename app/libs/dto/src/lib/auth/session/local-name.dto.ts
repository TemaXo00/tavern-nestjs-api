import { SessionLocalNameGateway } from '@org/types';

import { LocalName } from '../../decorators/local-name.decorator.js';

export class LocalNameDto implements SessionLocalNameGateway {
  @LocalName()
  localName: string;
}
