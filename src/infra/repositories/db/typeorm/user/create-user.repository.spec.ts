import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmCreateUserRepository } from './create-user.repository';
import { CreateUserRepository } from '../../../../../data/protocols/db/create-user-repository.protocol';
import { UserModel } from '../../../../../domain/models/user.model';
import { CreateUserModel } from '../../../../../domain/usecases/create-user.usecase';
import { User } from '../../../../entities/typeorm/user.entity';

jest.mock('node:crypto', () => {
  return {
    randomUUID: () => 'any_uuid',
  };
});
jest.mock('../../../../../utils/string.utils', () => {
  return {
    StringUtils: {
      random: () => 'any_confirmationCode',
    },
  };
});

const makeFakeUserData = (): CreateUserModel => {
  return {
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
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

class RepositoryStub {
  async findOneBy(): Promise<UserModel> {
    return null;
  }

  async save(): Promise<UserModel> {
    return makeFakeUser();
  }
}

describe('CreateUser Repository', () => {
  let sut: CreateUserRepository;
  let repository: RepositoryStub;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateUserRepository,
          useClass: TypeOrmCreateUserRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: RepositoryStub,
        },
      ],
    }).compile();

    sut = app.get<CreateUserRepository>(CreateUserRepository);
    repository = app.get(getRepositoryToken(User));
  });

  it('should call findOneBy with correct values', async () => {
    const fakeUser = makeFakeUserData();
    jest.spyOn(repository, 'findOneBy');

    await sut.create(fakeUser);
    expect(repository.findOneBy).toHaveBeenCalledWith({
      email: fakeUser.email,
    });
  });

  it('should return null if findOneBy returns user', async () => {
    const fakeUser = makeFakeUserData();
    jest.spyOn(repository, 'findOneBy').mockReturnValueOnce(Promise.resolve(makeFakeUser()));

    const user = await sut.create(fakeUser);
    expect(user).toBeNull();
  });

  it('should call save with correct values', async () => {
    const fakeUser = makeFakeUserData();
    jest.spyOn(repository, 'findOneBy').mockReturnValueOnce(null);
    jest.spyOn(repository, 'save');

    await sut.create(fakeUser);
    expect(repository.save).toHaveBeenCalledWith({
      id: 'any_uuid',
      confirmationCode: 'any_confirmationCode',
      ...fakeUser,
    });
  });

  it('should return new user if create on success', async () => {
    const fakeUser = makeFakeUserData();
    const createdUser = makeFakeUser();

    const user = await sut.create(fakeUser);
    expect(user).toEqual(createdUser);
  });
});
