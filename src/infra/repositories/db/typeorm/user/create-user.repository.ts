import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserModel,
  CreateUserRepository,
  SensitiveInfoModel,
  UserModel,
} from './create-user.repository.protocols';
import { User } from '../../../../entities/typeorm/user.entity';

@Injectable()
export class TypeOrmCreateUserRepository implements CreateUserRepository {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  async create(userData: CreateUserModel & SensitiveInfoModel): Promise<UserModel> {
    const user = await this.repository.findOneBy({ email: userData.email });
    if (user) {
      return null;
    }

    return await this.repository.save(userData);
  }
}
