import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.usecase';
import { Hasher, UUID } from './create-user.protocols';
import { CreateUser, CreateUserModel } from '../../../domain/usecases/create-user.usecase';
import { CreateUserRepository } from '../../../data/protocols/db/create-user-repository.protocol';
import { ConfirmationCode } from '../../../infra/db/crypto.adapter.protocols';

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
    generateUniqueId(): string {
      return 'any_uuid';
    }
  };
};

const makeConfirmationCode = () => {
  return class ConfirmationCodeStub implements ConfirmationCode {
    generateConfirmationCode(length: number): string {
      return 'any_confirmation_code';
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
  let confirmationCode: ConfirmationCode;
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
          provide: ConfirmationCode,
          useClass: makeConfirmationCode(),
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
    confirmationCode = app.get<ConfirmationCode>(ConfirmationCode);
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
      const userData = Object.assign({}, data, {
        id: 'any_uuid',
        password: 'hashed_password',
        confirmationCode: 'any_confirmation_code',
      });
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

    it('should calls uuid.generateUniqueId', async () => {
      const data = makeFakeUserData();
      const generateUniqueIdSpy = jest.spyOn(uuid, 'generateUniqueId');

      await createUserUseCase.create(data);
      expect(generateUniqueIdSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw if uuid.generateUniqueId throws', async () => {
      const data = makeFakeUserData();
      jest.spyOn(uuid, 'generateUniqueId').mockImplementationOnce(() => {
        throw new Error();
      });

      const promise = createUserUseCase.create(data);
      expect(promise).rejects.toThrow();
    });

    it('should calls confirmationCode.generateConfirmationCode with correct value', async () => {
      const data = makeFakeUserData();
      const generateConfirmationCodeSpy = jest.spyOn(confirmationCode, 'generateConfirmationCode');
      const length = 6;

      await createUserUseCase.create(data);
      expect(generateConfirmationCodeSpy).toHaveBeenCalledWith(length);
    });
  });
});
