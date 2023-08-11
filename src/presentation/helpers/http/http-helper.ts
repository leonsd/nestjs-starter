import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export const success = <T>(data: T): T => {
  return data;
};

export const conflict = (message: string) => {
  return new ConflictException(message);
};

export const serverError = (error: Error) => {
  return new InternalServerErrorException(error.stack);
};
