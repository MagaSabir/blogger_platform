import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';

describe('BlogController (e2e)', () => {
  let app: INestApplication<App>;
  const credentials = 'admin:qwerty';
  const base64 = Buffer.from(credentials).toString('base64');

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create blog', async () => {
    return request(app.getHttpServer())
      .post('/blogs/')
      .set('Authorization', `Basic ${base64}`)
      .send({
        name: 'test',
        description: 'test1',
        websiteUrl: 'https://testUrl.com',
      })
      .expect(201);
  });

  it('should return blog', async () => {
    const createdBlog = await request(app.getHttpServer())
      .get('/blogs?pageNumber=1&pageSize=10')
      .expect(200);
    expect(createdBlog.body).toHaveLength(1);
  });
});
