import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { Connection } from 'mongoose';
import cookieParser from 'cookie-parser';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            ttl: 10000, // 10 секунд
            limit: 5, // 5 запросов
          },
        ]),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    connection = moduleFixture.get<Connection>(getConnectionToken());

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    app.getHttpAdapter().getInstance().set('trust proxy', true);

    await app.init();
    for (const collection of Object.keys(connection.collections)) {
      await connection.collections[collection].deleteMany({});
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should allow 5 requests within 10 seconds', async () => {
      const loginData = {
        username: 'testuser',
        password: 'testpassword',
      };

      // Первые 5 запросов должны быть успешными (401 из-за неверных credentials, но не 429)
      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginData)
          .expect(401); // LocalAuthGuard возвращает 401 при неверных credentials

        expect(response.status).not.toBe(429); // Важно: не должно быть 429
      }
    });

    it('should block 6th request with 429 status', async () => {
      const loginData = {
        username: 'testuser',
        password: 'testpassword',
      };

      // Делаем 6-й запрос
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(429); // Должен вернуть 429 Too Many Requests

      expect(response.body).toEqual({
        statusCode: 429,
        message: 'ThrottlerException: Too Many Requests',
      });
    });

    it('should reset counter after ttl expiration', async () => {
      const loginData = {
        username: 'testuser',
        password: 'testpassword',
      };

      // Ждем больше чем TTL (10 секунд)
      await new Promise((resolve) => setTimeout(resolve, 11000));

      // После истечения TTL запросы снова должны работать
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401); // Снова 401, а не 429

      expect(response.status).not.toBe(429);
    });
  });
  jest.setTimeout(12000);

  describe('Different IP addresses', () => {
    it('should throttle per IP address', async () => {
      const loginData = {
        username: 'testuser',
        password: 'testpassword',
      };

      // Делаем 5 запросов с одного IP
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer())
          .post('/auth/login')
          .set('X-Forwarded-For', '192.168.1.1')
          .send(loginData)
          .expect(401);
      }

      // 6-й запрос с того же IP должен быть заблокирован
      await request(app.getHttpServer())
        .post('/auth/login')
        .set('X-Forwarded-For', '192.168.1.1')
        .send(loginData)
        .expect(429);

      // Но запрос с другого IP должен работать
      await request(app.getHttpServer())
        .post('/auth/login')
        .set('X-Forwarded-For', '192.168.1.2')
        .send(loginData)
        .expect(401);
    });
  });

  describe('Session', () => {
    let token: string;
    let cookies: [] | string;
    let deviceId: string;
    const loginData = {
      loginOrEmail: 'test2',
      password: 'test2',
    };
    it('should create user and login', async () => {
      const basicAuthCredentials = 'admin:qwerty';
      const base64Credentials =
        Buffer.from(basicAuthCredentials).toString('base64');

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Basic ${base64Credentials}`)
        .send({
          login: 'test2',
          password: 'test2',
          email: 'example@example2.com',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .set('User-Agent', 'test')
        .send(loginData)
        .expect(200);
      cookies = response.headers['set-cookie'];
      token = cookies[0];
    });

    it('should get all active sessions', async () => {
      const session = await request(app.getHttpServer())
        .get('/security/devices')
        .set('Cookie', token)
        .expect(200);
      expect(session.body).toBeDefined();
      expect(session.body).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      deviceId = session.body[0].deviceId;
    });

    it('should delete session by device id', async () => {
      await request(app.getHttpServer())
        .delete(`/security/devices/${deviceId}`)
        .set('Cookie', token)
        .expect(204);
    });
  });

  describe('should create 3 user with different deviceId, loged,  delete other sessions', () => {
    let token: string;

    it('should create 3 user', async () => {
      const basicAuthCredentials = 'admin:qwerty';
      const base64Credentials =
        Buffer.from(basicAuthCredentials).toString('base64');
      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Basic ${base64Credentials}`)
        .send({
          login: 'test3',
          password: 'test3',
          email: 'example@example3.com',
        })
        .expect(201);
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Basic ${base64Credentials}`)
        .send({
          login: 'test4',
          password: 'test4',
          email: 'example@example4.com',
        })
        .expect(201);

      const response2 = await request(app.getHttpServer())
        .post('/auth/login')
        .set('User-Agent', 'test')
        .send({ loginOrEmail: 'test4', password: 'test4' })
        .expect(200);
      const cookies = response2.headers['set-cookie'];
      token = cookies[0];
    });

    it('should get all active sessions', async () => {
      const session = await request(app.getHttpServer())
        .get('/security/devices')
        .set('Cookie', token)
        .expect(200);
      expect(session.body).toBeDefined();
    });

    it('should delete all sessions except the current one', async () => {
      const sessions = await request(app.getHttpServer())
        .delete('/security/devices')
        .set('Cookie', token)
        .expect(204);

      const res = await request(app.getHttpServer())
        .get('/security/devices')
        .set('Cookie', token)
        .expect(200);
      expect(res.body).toBeDefined();
      console.log(res.body);
    });
  });
});
