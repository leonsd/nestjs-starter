import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUser } from '../../../domain/usecases/create-user.usecase';
import { UserModel } from '../../../domain/models/user.model';
import { conflict, serverError, success } from '../../helpers/http/http-helper';
import { CreateUserDto } from '../../validators/create-user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly createUser: CreateUser) {}

  @Post()
  async create(@Body() data: CreateUserDto): Promise<UserModel | Error> {
    try {
      const user = await this.createUser.create(data);
      if (!user) {
        return conflict('Email already in use');
      }

      return success<UserModel>(user);
    } catch (error) {
      return serverError(error);
    }
  }
}
