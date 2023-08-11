import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './create-user.controller';
import {
  CreateUser,
  CreateUserModel,
} from '../../../domain/usecases/create-user.usecase';

const makeFakeUserData = () => {
  return {
    name: 'any_username',
    email: 'any_email@mail.com',
    password: 'any_password',
  };
};

class CreateUserUseCaseStub implements CreateUser {
  async create(data: CreateUserModel): Promise<any> {
    return {
      id: 'any_id',
      name: 'any_username',
      email: 'any_email@mail.com',
      password: 'any_password',
    };
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

  it('should call userService.create with correct params', async () => {
    const body = makeFakeUserData();
    jest.spyOn(createUserUseCase, 'create');

    await sut.create(body);
    expect(createUserUseCase.create).toHaveBeenCalledWith(body);
  });
});
