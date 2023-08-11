import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUser } from '../../../domain/usecases/create-user.usecase';
import { CreateUserDto } from '../../validators/create-user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly createUser: CreateUser) {}

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.createUser.create(data);
  }
}
