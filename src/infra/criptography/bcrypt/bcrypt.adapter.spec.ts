import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt.adapter';

jest.mock('bcrypt', () => {
  return {
    hash: (): Promise<string> => Promise.resolve('hashedValue'),
  };
});

interface SutTypes {
  sut: BcryptAdapter;
  salt: number;
}

const makeSut = (): SutTypes => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);

  return { sut, salt };
};

describe('Bcrypt Adapter', () => {
  it('Should call hash with correct values', async () => {
    const { sut, salt } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.hash('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('Should return hashed value on success', async () => {
    const { sut } = makeSut();

    const response = await sut.hash('any_value');
    expect(response).toBe('hashedValue');
  });

  it('Should throw if hash throws', async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.hash('any_value');
    expect(promise).rejects.toThrow();
  });
});
