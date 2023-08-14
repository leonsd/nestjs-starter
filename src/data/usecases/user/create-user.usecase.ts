import { Injectable } from '@nestjs/common';
import { CreateUserRepository, Hasher, UUID } from './create-user.protocols';
import {
  CreateUser,
  CreateUserModel,
} from '../../../domain/usecases/create-user.usecase';
import { UserModel } from '../../../domain/models/user.model';

@Injectable()
export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly hasher: Hasher,
    private readonly uuid: UUID,
    private readonly createUserRepository: CreateUserRepository
  ) {}

  async create(data: CreateUserModel): Promise<UserModel> {
    const hashedPassword = await this.hasher.hash(data.password);
    const uuid = this.uuid.generateUniqueId();
    const userData = Object.assign({}, data, {
      id: uuid,
      password: hashedPassword,
    });

    return await this.createUserRepository.create(userData);
  }
}
