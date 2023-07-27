import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { ormconfig } from '../src/config/ormconfig';
import { UserModule } from '../src/modules/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;

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

    await app.init();
  });

  describe('/users (POST)', () => {
    it('should return status code 201 and correct body', () => {
      const user = {
        name: 'any_username',
        email: 'any_email@mail.com',
        password: 'any_password',
      };
      return request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201)
        .expect(user);
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
  });

  describe('/users/:id (GET)', () => {
    it('should return status code 200 and correct body', () => {
      const id = 1;
      return request(app.getHttpServer())
        .get(`/users/${id}`)
        .expect(200)
        .expect({});
    });

    it('should return status code 400 if "id" is not a number', () => {
      const id = 'any_id';
      return request(app.getHttpServer()).get(`/users/${id}`).expect(400);
    });
  });
});
