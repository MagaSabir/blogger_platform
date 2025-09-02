import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';

describe('BlogController (e2e)', () => {
  let app: INestApplication<App>;
  const credentials = 'admin:qwerty';
  const base64 = Buffer.from(credentials).toString('base64');
  let blogId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  it('should create blog', async () => {
    const createdBlog = await request(app.getHttpServer())
      .post('/blogs/')
      .set('Authorization', `Basic ${base64}`)
      .send({
        name: 'test',
        description: 'test1',
        websiteUrl: 'https://testUrl.com',
      })
      .expect(201);
    blogId = createdBlog.body.id;
  });

  it('should return blog', async () => {
    const createdBlog = await request(app.getHttpServer())
      .get('/blogs?pageNumber=1&pageSize=10')
      .expect(200);
    expect(createdBlog.body).toBeDefined();
  });

  it('should update blog by id', async () => {
    const updatedBlog = await request(app.getHttpServer())
      .put(`/blogs/${blogId}`)
      .set('Authorization', `Basic ${base64}`)
      .send({
        name: 'updatedBlog',
        description: 'test1',
        websiteUrl: 'https://testUrl.com',
      })
      .expect(204);

    const blog = await request(app.getHttpServer())
      .get(`/blogs/${blogId}`)
      .expect(200);
    expect(blog.body.name).toBe('updatedBlog');
  });
});
