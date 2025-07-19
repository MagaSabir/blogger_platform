import { Module } from '@nestjs/common';
import { BlogsService } from './blog/application/blogs.service';
import { BlogsRepository } from './blog/infrastructure/blogs.repository';
import { BlogsController } from './blog/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog/domain/blog.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository],
  // exports: [BlogsService],
})
export class BloggersPlatformModule {}
