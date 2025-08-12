import { Module } from '@nestjs/common';
import { BlogsService } from './blog/application/blogs.service';
import { BlogsRepository } from './blog/infrastructure/blogs.repository';
import { BlogsController } from './blog/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog/domain/blog.entity';
import { QueryBlogRepository } from './blog/infrastructure/query-repository/query.blog.repository';
import { PostController } from './post/api/post.controller';
import { PostService } from './post/application/service/post.service';
import { PostsRepository } from './post/infrastructure/posts.repository';
import { QueryPostRepository } from './post/infrastructure/query-repository/query.post.repository';
import { Post, PostSchema } from './post/domain/post.entity';
import { CommentRepository } from './comments/infrastructure/comment.repository';
import { CommentQueryRepository } from './comments/infrastructure/query/comment.query.repository';
import { Comments, CommentSchema } from './comments/domain/comment.domain';
import { CommentController } from './comments/api/comment.controller';
import { CommentCreateUseCase } from './comments/application/usecases/comment-create.usecase';
import { GetCommentHandler } from './comments/application/queries/get-comment.query';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { UpdateCommentUseCase } from './comments/application/usecases/update-comment.usecase';
import { GetAllCommentByIdHandler } from './comments/application/queries/get-all-comments-by-id.query';
import { DeleteCommentUseCase } from './comments/application/usecases/delete-comment.usecase';

const queryHandlers = [GetAllCommentByIdHandler, GetCommentHandler];
const commandHandlers = [
  CommentCreateUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
];
@Module({
  imports: [
    JwtModule,
    CqrsModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comments.name, schema: CommentSchema },
    ]),
  ],
  controllers: [BlogsController, PostController, CommentController],
  providers: [
    BlogsService,
    BlogsRepository,
    QueryBlogRepository,
    PostService,
    PostsRepository,
    QueryPostRepository,
    CommentRepository,
    CommentQueryRepository,
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class BloggersPlatformModule {}
