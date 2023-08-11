import { randomInt } from 'node:crypto';

export const StringUtils = {
  random: (length: number) => {
    const max = 1_000_000;
    return randomInt(max).toString().padStart(length, '0');
  },
};
