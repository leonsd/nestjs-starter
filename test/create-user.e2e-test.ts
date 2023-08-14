import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { ormconfig } from '../src/main/config/ormconfig';
import { UserModule } from '../src/modules/user.module';
import { User } from '../src/infra/entities/typeorm/user.entity';

const makeFakeUserData = () => {
  return {
    name: 'any_username',
    email: 'any_email@mail.com',
    password: 'aNy_pa55word',
  };
};

describe('CreateUser Controller (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(ormconfig),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector))
    );

    await app.init();
    repository = app.get(getRepositoryToken(User));
    await repository.delete({});
  });

  describe('/users (POST)', () => {
    it('should return status code 201 and correct body', async () => {
      const user = makeFakeUserData();

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(user);
      expect(response.statusCode).toBe(201);
      expect(response.body).toBeTruthy();
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe(user.name);
      expect(response.body.email).toBe(user.email);
    });

    it('should return status code 400 if not send name', () => {
      const user = {
        email: 'any_email@mail.com',
        password: 'any_password',
      };
      return request(app.getHttpServer()).post('/users').send(user).expect(400);
    });

    it('should return status code 400 if not send email', () => {
      const user = {
        name: 'any_username',
        password: 'any_password',
      };
      return request(app.getHttpServer()).post('/users').send(user).expect(400);
    });

    it('should return status code 400 if not send password', () => {
      const user = {
        name: 'any_username',
        email: 'any_email@mail.com',
      };
      return request(app.getHttpServer()).post('/users').send(user).expect(400);
    });

    it('should return status code 400 if send empty body', () => {
      const user = {};
      return request(app.getHttpServer()).post('/users').send(user).expect(400);
    });

    it('should return status code 409 if email already exists', async () => {
      const user = makeFakeUserData();
      await request(app.getHttpServer()).post('/users').send(user);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(user);
      expect(response.statusCode).toBe(409);
    });
  });
});
