import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { CreateUserDto } from '../../validators/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get(':id')
  show(@Param('id') id: number) {
    return this.userService.show(id);
  }
}
