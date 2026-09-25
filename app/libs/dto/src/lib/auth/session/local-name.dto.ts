import { SessionLocalNameGateway } from '@org/types';

import { LocalName } from '../../decorators/local-name.decorator.js';

export class LocalNameDTO implements SessionLocalNameGateway {
  @LocalName()
  localName: string;
}
