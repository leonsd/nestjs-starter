import { randomInt } from 'node:crypto';

export const randomString = (length: number) => {
  const max = 1_000_000;
  return randomInt(max).toString().padStart(length, '0');
};
