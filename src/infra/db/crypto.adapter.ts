import { randomInt, randomUUID } from 'node:crypto';
import { ConfirmationCode, UUID } from './crypto.adapter.protocols';

export class CryptoAdapter implements UUID, ConfirmationCode {
  generateUniqueId(): string {
    return randomUUID();
  }

  generateConfirmationCode(length: number): string {
    const max = 1_000_000;
    return randomInt(max).toString().padStart(length, '0');
  }
}
