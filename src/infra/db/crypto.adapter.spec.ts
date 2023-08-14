import crypto from 'node:crypto';
import { CryptoAdapter } from './crypto.adapter';

jest.mock('node:crypto', () => {
  return {
    randomUUID: (): string => 'any_uuid',
  };
});

interface SutTypes {
  sut: CryptoAdapter;
}

const makeSut = (): SutTypes => {
  const sut = new CryptoAdapter();
  return { sut };
};

describe('Bcrypt Adapter', () => {
  it('Should call hash', async () => {
    const { sut } = makeSut();
    const randomUUIDSpy = jest.spyOn(crypto, 'randomUUID');

    await sut.generate();
    expect(randomUUIDSpy).toHaveBeenCalledTimes(1);
  });
});
