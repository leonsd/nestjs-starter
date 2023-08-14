import crypto from 'node:crypto';
import { CryptoAdapter } from './crypto.adapter';

jest.mock('node:crypto', () => {
  return {
    randomUUID: (): string => 'any_uuid',
    randomInt: (): number => 123,
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

    sut.generateUniqueId();
    expect(randomUUIDSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw if randomUUID throws', async () => {
    const { sut } = makeSut();
    jest.spyOn(crypto, 'randomUUID').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => sut.generateUniqueId()).toThrow();
  });

  it('Should call randomInt', async () => {
    const { sut } = makeSut();
    const randomIntSpy = jest.spyOn(crypto, 'randomInt');
    const length = 6;

    sut.generateConfirmationCode(length);
    expect(randomIntSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw if randomInt throws', async () => {
    const { sut } = makeSut();
    jest.spyOn(crypto, 'randomInt').mockImplementationOnce(() => {
      throw new Error();
    });

    const length = 6;
    expect(() => sut.generateConfirmationCode(length)).toThrow();
  });
});
