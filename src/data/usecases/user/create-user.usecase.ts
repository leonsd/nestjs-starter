import { Injectable } from '@nestjs/common';
import {
  CreateUser,
  CreateUserModel,
} from '../../../domain/usecases/create-user.usecase';
import { CreateUserRepository } from '../../../data/protocols/db/create-user-repository.protocol';
import { UserModel } from '../../../domain/models/user.model';

@Injectable()
export class CreateUserUseCase implements CreateUser {
  constructor(private readonly createUserRepository: CreateUserRepository) {}

  async create(data: CreateUserModel): Promise<UserModel> {
    return await this.createUserRepository.create(data);
  }
}
