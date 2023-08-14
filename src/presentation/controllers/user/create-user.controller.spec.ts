import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './create-user.controller';
import { CreateUser, CreateUserModel } from '../../../domain/usecases/create-user.usecase';
import { conflict, success } from '../../helpers/http/http-helper';

const makeFakeUserData = () => {
  return {
    name: 'any_username',
    email: 'any_email@mail.com',
    password: 'any_password',
  };
};

const makeFakeUser = () => {
  return {
    id: 'any_id',
    name: 'any_username',
    email: 'any_email@mail.com',
    isConfirmed: false,
    createdAt: new Date('2023-08-11 23:59:59'),
    updatedAt: new Date('2023-08-11 23:59:59'),
  };
};

class CreateUserUseCaseStub implements CreateUser {
  async create(data: CreateUserModel): Promise<any> {
    return makeFakeUser();
  }
}

describe('CreateUser Controller', () => {
  let sut: UserController;
  let createUserUseCase: CreateUser;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: CreateUser, useClass: CreateUserUseCaseStub }],
    }).compile();

    sut = app.get<UserController>(UserController);
    createUserUseCase = app.get<CreateUser>(CreateUser);
  });

  it('should call createUser.create with correct params', async () => {
    const body = makeFakeUserData();
    jest.spyOn(createUserUseCase, 'create');

    await sut.create(body);
    expect(createUserUseCase.create).toHaveBeenCalledWith(body);
  });

  it('should return ConflictException if createUser returns null', async () => {
    const body = makeFakeUserData();
    jest.spyOn(createUserUseCase, 'create').mockReturnValueOnce(null);

    const promise = sut.create(body);
    expect(promise).rejects.toThrow(conflict('Email already in use'));
  });

  it('should return user if creation succeeds', async () => {
    const body = makeFakeUserData();

    const response = await sut.create(body);
    expect(response).toEqual(success(makeFakeUser()));
  });
});
