import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUser } from '../../../domain/usecases/create-user.usecase';
import { UserModel } from '../../../domain/models/user.model';
import { conflict, success } from '../../helpers/http/http-helper';
import { CreateUserDto } from '../../validators/create-user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly createUser: CreateUser) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    const user = await this.createUser.create(data);
    if (!user) {
      throw conflict('Email already in use');
    }

    return success<UserModel>(user);
  }
}
