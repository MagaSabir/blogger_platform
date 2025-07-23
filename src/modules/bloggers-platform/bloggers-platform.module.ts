import { Module } from '@nestjs/common';
import { BlogsService } from './blog/application/blogs.service';
import { BlogsRepository } from './blog/infrastructure/blogs.repository';
import { BlogsController } from './blog/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog/domain/blog.entity';
import { QueryBlogRepository } from './blog/infrastructure/query-repository/query.blog.repository';
import { PostController } from './post/api/post.controller';
import { PostService } from './post/application/post.service';
import { PostsRepository } from './post/infrastructure/posts.repository';
import { QueryPostRepository } from './post/infrastructure/query-repository/query.post.repository';
import { Post, PostSchema } from './post/domain/post.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [BlogsController, PostController],
  providers: [
    BlogsService,
    BlogsRepository,
    QueryBlogRepository,
    PostService,
    PostsRepository,
    QueryPostRepository,
  ],
})
export class BloggersPlatformModule {}
