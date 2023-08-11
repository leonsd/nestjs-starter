import * as crypto from 'node:crypto';
import { StringUtils as sut } from './string.utils';

jest.mock('node:crypto', () => {
  return {
    randomInt: () => '123456',
  };
});

describe('String Utils', () => {
  it('should return a random string', async () => {
    const length = 6;

    const string = sut.random(length);
    expect(string).toBeTruthy();
  });

  it('should throw if node:crypto throw', async () => {
    const length = 6;
    jest.spyOn(crypto, 'randomInt').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => sut.random(length)).toThrow();
  });

  it('should call randomInt with correct values', async () => {
    const length = 6;
    const max = 1_000_000;
    const randomIntSpy = jest.spyOn(crypto, 'randomInt');

    sut.random(length);
    expect(randomIntSpy).toHaveBeenLastCalledWith(max);
  });
});
