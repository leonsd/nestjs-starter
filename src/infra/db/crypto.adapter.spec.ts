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

describe('Crypto Adapter', () => {
  it('Should call randomUUID', async () => {
    const { sut } = makeSut();
    const randomUUIDSpy = jest.spyOn(crypto, 'randomUUID');

    sut.generate();
    expect(randomUUIDSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw if randomUUID throws', async () => {
    const { sut } = makeSut();
    jest.spyOn(crypto, 'randomUUID').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => sut.generate()).toThrow();
  });
});
