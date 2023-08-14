import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from '../data/usecases/user/create-user.usecase';
import { UserController } from '../presentation/controllers/user/create-user.controller';
import { User } from '../infra/entities/typeorm/user.entity';
import { CreateUser } from '../domain/usecases/create-user.usecase';
import { CreateUserRepository } from '../data/protocols/db/create-user-repository.protocol';
import { TypeOrmCreateUserRepository } from '../infra/repositories/db/typeorm/user/create-user.repository';
import { Hasher } from '../data/protocols/criptography/hasher';
import { BcryptAdapter } from '../infra/criptography/bcrypt/bcrypt.adapter';
import { UUID } from '../data/protocols/db/uuid.protocol';
import { CryptoAdapter } from '../infra/db/crypto.adapter';

const createUserUseCaseFactory = {
  provide: CreateUser,
  useClass: CreateUserUseCase,
};

const hasherFactory = {
  provide: Hasher,
  useFactory: () => {
    const salt = 12;
    return new BcryptAdapter(salt);
  },
};

const uuidFactory = {
  provide: UUID,
  useClass: CryptoAdapter,
};

const createUserRepository = {
  provide: CreateUserRepository,
  useClass: TypeOrmCreateUserRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    createUserUseCaseFactory,
    hasherFactory,
    uuidFactory,
    createUserRepository,
  ],
  controllers: [UserController],
})
export class UserModule {}
