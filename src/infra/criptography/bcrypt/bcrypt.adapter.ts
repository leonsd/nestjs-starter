import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Hasher } from '../../../data/protocols/criptography/hasher';

@Injectable()
export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hashed = await bcrypt.hash(value, this.salt);
    return hashed;
  }
}
