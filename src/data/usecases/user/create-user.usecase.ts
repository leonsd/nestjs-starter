import { Injectable } from '@nestjs/common';
import { CreateUserRepository, Hasher, UUID } from './create-user.protocols';
import { CreateUser, CreateUserModel } from '../../../domain/usecases/create-user.usecase';
import { UserModel } from '../../../domain/models/user.model';
import { ConfirmationCode } from '../../../infra/db/crypto.adapter.protocols';

@Injectable()
export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly hasher: Hasher,
    private readonly uuid: UUID,
    private readonly confirmationCode: ConfirmationCode,
    private readonly createUserRepository: CreateUserRepository
  ) {}

  async create(data: CreateUserModel): Promise<UserModel> {
    const hashedPassword = await this.hasher.hash(data.password);
    const uuid = this.uuid.generateUniqueId();
    const length = 6;
    const confirmationCode = this.confirmationCode.generateConfirmationCode(length);
    const userData = this.prepareUserData(data, hashedPassword, uuid, confirmationCode);

    return await this.createUserRepository.create(userData);
  }

  private prepareUserData(
    originalUserData: CreateUserModel,
    hashedPassword: string,
    uuid: string,
    confirmationCode: string
  ) {
    const userData = Object.assign({}, originalUserData, {
      id: uuid,
      password: hashedPassword,
      confirmationCode,
    });

    return userData;
  }
}
