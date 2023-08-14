import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import { CreateUserModel } from '../../../../../domain/usecases/create-user.usecase';
import { CreateUserRepository } from '../../../../../data/protocols/db/create-user-repository.protocol';
import { UserModel } from '../../../../../domain/models/user.model';
import { User } from '../../../../entities/typeorm/user.entity';
import { StringUtils } from '../../../../../utils/string.utils';

@Injectable()
export class TypeOrmCreateUserRepository implements CreateUserRepository {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  async create(userData: CreateUserModel): Promise<UserModel> {
    const additionalProperties = {
      id: randomUUID(),
      confirmationCode: StringUtils.random(6),
    };
    const data = Object.assign({}, userData, additionalProperties);
    const user = await this.repository.findOneBy({ email: userData.email });
    if (user) {
      return null;
    }

    return await this.repository.save(data);
  }
}
