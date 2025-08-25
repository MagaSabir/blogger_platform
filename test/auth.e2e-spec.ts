import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://0.0.0.0:27017/blogPlatform_test'),
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
    app.getHttpAdapter().getInstance().set('trust proxy', true);
    await app.init();
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
});
