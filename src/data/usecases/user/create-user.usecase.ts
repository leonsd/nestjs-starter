import { Injectable } from '@nestjs/common';
import { CreateUserRepository, Hasher, UUID } from './create-user.protocols';
import {
  CreateUser,
  CreateUserModel,
  SensitiveInfoModel,
} from '../../../domain/usecases/create-user.usecase';
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

  async create(userData: CreateUserModel): Promise<UserModel> {
    const hashedPassword = await this.hashPassword(userData.password);
    const uuid = this.generateUuid();
    const confirmationCode = this.generateConfirmationCode();
    const sensitiveInfo = { id: uuid, password: hashedPassword, confirmationCode };
    const data = this.prepareUserData(userData, sensitiveInfo);

    return await this.createUserRepository.create(data);
  }

  private async hashPassword(password: string) {
    return await this.hasher.hash(password);
  }

  private generateUuid() {
    return this.uuid.generateUniqueId();
  }

  private generateConfirmationCode() {
    const length = 6;
    return this.confirmationCode.generateConfirmationCode(length);
  }

  private prepareUserData(originalUserData: CreateUserModel, sensitiveInfo: SensitiveInfoModel) {
    const userData = Object.assign({}, originalUserData, {
      id: sensitiveInfo.id,
      password: sensitiveInfo.password,
      confirmationCode: sensitiveInfo.confirmationCode,
    });

    return userData;
  }
}
