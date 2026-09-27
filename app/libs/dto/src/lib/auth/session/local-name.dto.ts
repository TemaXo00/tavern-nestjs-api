import { LocalName } from '../../decorators/auth/local-name.decorator.js';

import type { SessionLocalNameBaseInput } from '@org/types';

export class LocalNameDto implements SessionLocalNameBaseInput {
  @LocalName()
  localName: string;
}
