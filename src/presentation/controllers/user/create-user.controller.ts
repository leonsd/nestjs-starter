import {
  Controller,
  Post,
  Body,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUser } from '../../../domain/usecases/create-user.usecase';
import { CreateUserDto } from '../../validators/create-user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly createUser: CreateUser) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    try {
      const user = await this.createUser.create(data);
      if (!user) {
        return new ConflictException('Email already in use');
      }

      return user;
    } catch (error) {
      return new InternalServerErrorException();
    }
  }
}
