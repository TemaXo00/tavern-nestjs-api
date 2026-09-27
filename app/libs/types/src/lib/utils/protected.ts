import { ValidateInput } from '../shared/validation.type.js';

export type Protected<T> = T extends null
  ? { validation: ValidateInput }
  : T & { validation: ValidateInput };
