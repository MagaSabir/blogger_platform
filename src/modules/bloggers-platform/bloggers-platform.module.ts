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
import { UsersModule } from '../user-accounts/users.module';
import { UpdateCommentUseCase } from './comments/application/usecases/update-comment.usecase';
import { GetAllCommentByIdHandler } from './comments/application/queries/get-all-comments-by-id.query';
import { DeleteCommentUseCase } from './comments/application/usecases/delete-comment.usecase';
import { LikeCommentRepository } from './likes/comments/infrastructure/like-comment.repository';
import {
  LikeComment,
  LikeSchema,
} from './likes/comments/domain/like-comment.domain';
import { SetLikeUseCase } from './comments/application/usecases/set-like.usecase';
import {
  LikePost,
  LikePostSchema,
} from './likes/posts/domain/like-post.domain';
import { LikePostRepository } from './likes/posts/infrastructure/like-post.repository';
import { LikePostUseCase } from './post/application/usecases/liike-post.usecase';
import { GetPostQueryHandler } from './post/application/quries/get-post.query';
import { GetAllPostsQueryHandler } from './post/application/quries/get-all-posts.query';
import { GetPostByBlogIdQueryHandler } from './blog/application/quries/get-post-by-id.query';
import { CreateBlogUseCase } from './blog/application/usecases/create-blog-usecase';
import { GetBlogByIdQueryHandler } from './blog/application/quries/get-blog-by-id.query';
import { CreatePostUseCase } from './post/application/usecases/create-post-usecase';
import { DeletePostUserCase } from './post/application/usecases/delete-post.usecase';
import { UpdatePostUseCase } from './post/application/usecases/update-post.usecase';
import { GetAllBlogsQueryHandler } from './blog/application/quries/get-all-blogs.query';
import { UpdateBlogUseCase } from './blog/application/usecases/update-blog-usecase';
import { DeleteBlogUseCase } from './blog/application/usecases/delete-blog-usecase';
import { CreatePostByBlogIdUseCase } from './blog/application/usecases/create-post-by-blogId-usecase';

const queryHandlers = [
  GetAllCommentByIdHandler,
  GetCommentHandler,
  GetPostQueryHandler,
  GetAllPostsQueryHandler,
  GetPostByBlogIdQueryHandler,
  GetBlogByIdQueryHandler,
  GetAllBlogsQueryHandler,
];
const commandHandlers = [
  CreateBlogUseCase,
  CommentCreateUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  SetLikeUseCase,
  LikePostUseCase,
  CreatePostUseCase,
  DeletePostUserCase,
  UpdatePostUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreateBlogUseCase,
  CreatePostByBlogIdUseCase,
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
      { name: LikeComment.name, schema: LikeSchema },
      { name: LikePost.name, schema: LikePostSchema },
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
    LikeCommentRepository,
    LikePostRepository,
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class BloggersPlatformModule {}
