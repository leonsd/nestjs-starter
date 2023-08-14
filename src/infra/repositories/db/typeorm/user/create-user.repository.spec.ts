import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCreateUserRepository } from './create-user.repository';
import { CreateUserRepository } from '../../../../../data/protocols/db/create-user-repository.protocol';
import { UserModel } from '../../../../../domain/models/user.model';
import {
  SensitiveInfoModel,
  CreateUserModel,
} from '../../../../../domain/usecases/create-user.usecase';
import { User } from '../../../../entities/typeorm/user.entity';

const makeFakeUserData = (): CreateUserModel & SensitiveInfoModel => {
  return {
    id: 'any_uuid',
    name: 'any_name',
    email: 'any_email',
    password: 'hashed_password',
    confirmationCode: 'any_confirmation_code',
  };
};

const makeFakeUser = (): UserModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    confirmationCode: 'any_confirmationCode',
    isConfirmed: false,
    createdAt: new Date('2023-08-11 23:59:59'),
    updatedAt: new Date('2023-08-11 23:59:59'),
  };
};

const makeRepositoryStub = () => {
  return class RepositoryStub {
    async findOneBy(): Promise<UserModel> {
      return null;
    }

    async save(): Promise<UserModel> {
      return makeFakeUser();
    }
  };
};

describe('CreateUser Repository', () => {
  let sut: CreateUserRepository;
  let repository: Repository<User>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateUserRepository,
          useClass: TypeOrmCreateUserRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: makeRepositoryStub(),
        },
      ],
    }).compile();

    sut = app.get<CreateUserRepository>(CreateUserRepository);
    repository = app.get(getRepositoryToken(User));
  });

  it('should call findOneBy with correct values', async () => {
    const fakeUserData = makeFakeUserData();
    jest.spyOn(repository, 'findOneBy');

    await sut.create(fakeUserData);
    expect(repository.findOneBy).toHaveBeenCalledWith({
      email: fakeUserData.email,
    });
  });

  it('should return null if findOneBy returns user', async () => {
    const fakeUserData = makeFakeUserData();
    jest.spyOn(repository, 'findOneBy').mockReturnValueOnce(Promise.resolve(makeFakeUser()));

    const user = await sut.create(fakeUserData);
    expect(user).toBeNull();
  });

  it('should call save with correct values', async () => {
    const fakeUserData = makeFakeUserData();
    jest.spyOn(repository, 'findOneBy').mockReturnValueOnce(null);
    jest.spyOn(repository, 'save');

    await sut.create(fakeUserData);
    expect(repository.save).toHaveBeenCalledWith(fakeUserData);
  });

  it('should return new user if create on success', async () => {
    const fakeUserData = makeFakeUserData();
    const createdUser = makeFakeUser();

    const user = await sut.create(fakeUserData);
    expect(user).toEqual(createdUser);
  });
});
