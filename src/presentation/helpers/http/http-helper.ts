import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

export const success = <T>(data: T): T => {
  return data;
};

export const unauthorized = () => {
  return new UnauthorizedException();
};

export const conflict = (message: string) => {
  return new ConflictException(message);
};

export const serverError = (error: Error) => {
  return new InternalServerErrorException(error.stack);
};
