import { Injectable } from '@nestjs/common';
import { CreateUserRepository, Hasher } from './create-user.protocols';
import {
  CreateUser,
  CreateUserModel,
} from '../../../domain/usecases/create-user.usecase';
import { UserModel } from '../../../domain/models/user.model';

@Injectable()
export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly hasher: Hasher,
    private readonly createUserRepository: CreateUserRepository
  ) {}

  async create(data: CreateUserModel): Promise<UserModel> {
    await this.hasher.hash(data.password);
    return await this.createUserRepository.create(data);
  }
}
