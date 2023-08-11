import { ConflictException } from '@nestjs/common';

export const success = <T>(data: T): T => {
  return data;
};

export const conflict = (message: string) => {
  return new ConflictException(message);
};
