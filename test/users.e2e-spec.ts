import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST)', async () => {
    const basicAuthCredentials = 'admin:qwerty';
    const base64Credentials =
      Buffer.from(basicAuthCredentials).toString('base64');
    const user = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Basic ${base64Credentials}`)
      .send({
        login: 'user12',
        password: 'user12',
        email: 'User1@example.com',
      })
      .expect(201);
    expect(user.body.isEmailConfirmed);
    console.log(user.body);
  });
});
