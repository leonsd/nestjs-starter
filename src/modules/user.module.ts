import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from '../data/usecases/user/create-user.usecase';
import { UserController } from '../presentation/controllers/user/create-user.controller';
import { User } from '../infra/entities/typeorm/user.entity';
import { CreateUser } from '../domain/usecases/create-user.usecase';
import { CreateUserRepository } from '../data/protocols/db/create-user-repository.protocol';
import { TypeOrmCreateUserRepository } from '../infra/repositories/db/typeorm/user/create-user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: CreateUser,
      useClass: CreateUserUseCase,
    },
    {
      provide: CreateUserRepository,
      useClass: TypeOrmCreateUserRepository,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
