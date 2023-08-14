import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.usecase';
import { Hasher } from './create-user.protocols';
import {
  CreateUser,
  CreateUserModel,
} from '../../../domain/usecases/create-user.usecase';
import { CreateUserRepository } from '../../../data/protocols/db/create-user-repository.protocol';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt/bcrypt.adapter';

const makeFakeUserData = () => {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  };
};

class CreateUserRepositoryStub implements CreateUserRepository {
  async create(createUserModel: CreateUserModel): Promise<any> {
    return {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    };
  }
}

describe('CreateUser UseCase', () => {
  let createUserUseCase: CreateUser;
  let hasher: Hasher;
  let createUserRepository: CreateUserRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateUser,
          useClass: CreateUserUseCase,
        },
        {
          provide: Hasher,
          useFactory: () => {
            const salt = 12;
            return new BcryptAdapter(salt);
          },
        },
        {
          provide: CreateUserRepository,
          useClass: CreateUserRepositoryStub,
        },
      ],
    }).compile();

    createUserUseCase = app.get<CreateUser>(CreateUser);
    hasher = app.get<Hasher>(Hasher);
    createUserRepository = app.get<CreateUserRepository>(CreateUserRepository);
  });

  describe('create', () => {
    it('should calls hasher with correct params', async () => {
      const data = makeFakeUserData();
      jest.spyOn(hasher, 'hash');

      await createUserUseCase.create(data);
      expect(hasher.hash).toHaveBeenCalledWith(data.password);
    });

    it('should calls createUserRepository.create with correct params', async () => {
      const data = makeFakeUserData();
      jest.spyOn(createUserRepository, 'create');

      await createUserUseCase.create(data);
      expect(createUserRepository.create).toHaveBeenCalledWith(data);
    });

    it('should throw if createUserRepository.create throws', async () => {
      const data = makeFakeUserData();
      jest.spyOn(createUserRepository, 'create').mockImplementationOnce(() => {
        throw new Error();
      });

      const promise = createUserUseCase.create(data);
      await expect(promise).rejects.toThrow();
    });
  });
});
