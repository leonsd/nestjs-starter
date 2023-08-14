import { randomUUID } from 'node:crypto';
import { UUID } from '../../data/protocols/db/uuid';

export class CryptoAdapter implements UUID {
  generate(): string {
    return randomUUID();
  }
}
