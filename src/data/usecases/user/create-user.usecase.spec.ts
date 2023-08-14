import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.usecase';
import { Hasher, UUID } from './create-user.protocols';
import {
  CreateUser,
  CreateUserModel,
} from '../../../domain/usecases/create-user.usecase';
import { CreateUserRepository } from '../../../data/protocols/db/create-user-repository.protocol';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt/bcrypt.adapter';

jest.mock('bcrypt', () => {
  return {
    hash: () => 'hashed_password',
  };
});

const makeFakeUserData = () => {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  };
};

const makeHasher = () => {
  return class hasherStub implements Hasher {
    hash(value: string): Promise<string> {
      return Promise.resolve('hashed_password');
    }
  };
};

const makeUUID = () => {
  return class UUIDStub implements UUID {
    generate(): string {
      return 'any_uuid';
    }
  };
};

const makeCreateUserRepository = () => {
  return class CreateUserRepositoryStub implements CreateUserRepository {
    async create(createUserModel: CreateUserModel): Promise<any> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      };
    }
  };
};

describe('CreateUser UseCase', () => {
  let createUserUseCase: CreateUser;
  let hasher: Hasher;
  let uuid: UUID;
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
          useClass: makeHasher(),
        },
        {
          provide: UUID,
          useClass: makeUUID(),
        },
        {
          provide: CreateUserRepository,
          useClass: makeCreateUserRepository(),
        },
      ],
    }).compile();

    createUserUseCase = app.get<CreateUser>(CreateUser);
    hasher = app.get<Hasher>(Hasher);
    uuid = app.get<UUID>(UUID);
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
      const userData = Object.assign({}, data, { password: 'hashed_password' });
      expect(createUserRepository.create).toHaveBeenCalledWith(userData);
    });

    it('should throw if createUserRepository.create throws', async () => {
      const data = makeFakeUserData();
      jest.spyOn(createUserRepository, 'create').mockImplementationOnce(() => {
        throw new Error();
      });

      const promise = createUserUseCase.create(data);
      await expect(promise).rejects.toThrow();
    });

    it('should calls uuid.generate', async () => {
      const data = makeFakeUserData();
      const generateSpy = jest.spyOn(uuid, 'generate');

      await createUserUseCase.create(data);
      expect(generateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
