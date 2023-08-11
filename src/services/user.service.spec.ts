import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { CreateUserDto } from '../validators/create-user.dto';
import { User } from '../entities/user.entity';
import { MockFactory } from '../utils/tests/mock-factory';
import { NotFoundException } from '../exceptions/notfound.exception';

describe('UserService', () => {
  let userRepository: Repository<User>;
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: MockFactory.getMock(Repository<User>),
        },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
    userRepository = app.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should calls userRepository.save with correct params', async () => {
      const data = {
        name: 'any_username',
        email: 'any_email@mail.com',
        password: 'any_password',
      } as CreateUserDto;
      jest
        .spyOn(userRepository, 'save')
        .mockImplementationOnce(() => Promise.resolve(data) as Promise<User>);

      await userService.create(data);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(data)
      );
    });
  });

  describe('show', () => {
    it('should calls userRepository.findOneBy with correct params', async () => {
      const id = 1;
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve({}) as Promise<User>);

      const response = await userService.show(id);
      expect(response).toEqual({});
      expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException', async () => {
      expect.assertions(1);

      try {
        const id = 1;
        jest
          .spyOn(userRepository, 'findOneBy')
          .mockImplementationOnce(() => Promise.resolve(null));

        await userService.show(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
