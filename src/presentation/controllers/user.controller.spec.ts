import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from '../../services/user.service';
import { UserModule } from '../../modules/user.module';
import { ormconfig } from '../../config/ormconfig';
import { User } from '../../entities/user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(ormconfig), UserModule],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should call userService.create with correct params', async () => {
      const body = {
        name: 'any_username',
        email: 'any_email@mail.com',
        password: 'any_password',
      };
      jest
        .spyOn(userService, 'create')
        .mockImplementationOnce(() => Promise.resolve(body) as Promise<User>);

      await userController.create(body);
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledWith(body);
    });
  });

  describe('show', () => {
    it('should call userService.show with correct params', async () => {
      const id = 1;
      jest
        .spyOn(userService, 'show')
        .mockImplementationOnce(() => Promise.resolve({}) as Promise<User>);

      await userController.show(id);
      expect(userService.show).toHaveBeenCalledTimes(1);
      expect(userService.show).toHaveBeenCalledWith(id);
    });
  });
});
