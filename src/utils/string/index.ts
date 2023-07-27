import { randomInt } from 'node:crypto';

export const generateConfirmationCode = () => {
  const max = 1000000;
  return randomInt(max).toString().padStart(6, '0');
};
