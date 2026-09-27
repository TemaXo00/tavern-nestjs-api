import { SessionInput } from '../shared/validation.type.js';

export type WithSession<T> = T & { session: SessionInput };
