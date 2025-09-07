import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsQueryParams } from './input-validation-dto/PostsQueryParams';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CommentCreateCommand } from '../../comments/application/usecases/comment-create.usecase';
import { JwtAuthGuard } from '../../../user-accounts/users/guards/bearer/jwt-auth.guard';
import { GetUserByIdQuery } from '../../../user-accounts/users/application/queries/get-user-byId.query';
import { UserViewDto } from '../../../user-accounts/users/application/queries/view-dto/user.view-dto';
import { GetCommentQuery } from '../../comments/application/queries/get-comment.query';
import { CreateInputPostDto } from './input-validation-dto/create-blog.input.dto';
import { CommentInputDto } from '../../comments/api/input-dto/comment-input.dto';
import { ObjectIdValidationPipe } from '../../../../core/pipes/object-id-validation.pipe';
import { CommentQueryParams } from '../../comments/api/input-dto/CommentQueryParams';
import { GetAllCommentsByIdQuery } from '../../comments/application/queries/get-all-comments-by-id.query';
import { BasicAuthGuard } from '../../../user-accounts/users/guards/basic/basic-auth.guard';
import { LikeStatusInputDto } from '../../comments/api/input-dto/like-status.input-dto';
import { JwtOptionalAuthGuard } from '../../../user-accounts/users/guards/bearer/Jwt-optional-auth.guard';
import { LikePostCommand } from '../application/usecases/liike-post.usecase';
import { GetPostQuery } from '../application/quries/get-post.query';
import { GetAllPostsQuery } from '../application/quries/get-all-posts.query';
import { CreatePostCommand } from '../application/usecases/create-post-usecase';
import { CurrentUserId } from '../../../../core/decorators/current-user-id';
import { DeletePostCommand } from '../application/usecases/delete-post.usecase';
import { UpdatePostCommand } from '../application/usecases/update-post.usecase';
import { PostViewDto } from '../application/quries/view-dto/post.view-dto';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';
import { CommentViewDto } from '../../comments/application/queries/view-dto/comment.view-dto';

@Controller('posts')
export class PostController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}
  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() dto: CreateInputPostDto): Promise<PostViewDto> {
    const postId: string = await this.commandBus.execute(
      new CreatePostCommand(dto),
    );
    return await this.queryBus.execute<GetPostQuery, PostViewDto>(
      new GetPostQuery(postId),
    );
  }

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard)
  async getPostById(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ): Promise<PostViewDto> {
    return await this.queryBus.execute<GetPostQuery, PostViewDto>(
      new GetPostQuery(id, userId),
    );
  }

  @Get()
  @UseGuards(JwtOptionalAuthGuard)
  async getPosts(
    @Query() query: PostsQueryParams,
    @CurrentUserId() userId: string,
  ): Promise<BasePaginatedResponse<PostViewDto>> {
    return await this.queryBus.execute<
      GetAllPostsQuery,
      BasePaginatedResponse<PostViewDto>
    >(new GetAllPostsQuery(query, userId));
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id') id: string,
    @Body() dto: CreateInputPostDto,
  ): Promise<void> {
    await this.commandBus.execute<UpdatePostCommand, void>(
      new UpdatePostCommand(dto, id),
    );
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute<DeletePostCommand, void>(
      new DeletePostCommand(id),
    );
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Body() body: CommentInputDto,
    @Param('id', ObjectIdValidationPipe) postId: string,
    @CurrentUserId() userId: string,
  ): Promise<CommentViewDto> {
    const user: UserViewDto = await this.queryBus.execute<
      GetUserByIdQuery,
      UserViewDto
    >(new GetUserByIdQuery(userId));
    const dto = {
      content: body.content,
      postId: postId,
      user: { userId: userId, userLogin: user.login },
    };
    const commentId: string = await this.commandBus.execute<
      CommentCreateCommand,
      string
    >(new CommentCreateCommand(dto));
    return await this.queryBus.execute<GetCommentQuery, CommentViewDto>(
      new GetCommentQuery(commentId, dto.user.userId),
    );
  }
  //TODO create types for outputDto in controller methods
  @Get(':id/comments')
  @UseGuards(JwtOptionalAuthGuard)
  async getCommentsByPostId(
    @Param('id', ObjectIdValidationPipe) postId: string,
    @CurrentUserId() userId: string,
    @Query() query: CommentQueryParams,
  ): Promise<BasePaginatedResponse<CommentViewDto>> {
    return await this.queryBus.execute<
      GetAllCommentsByIdQuery,
      BasePaginatedResponse<CommentViewDto>
    >(new GetAllCommentsByIdQuery(postId, userId, query));
    //TODO send data as object to other service or repository
  }

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Body() status: LikeStatusInputDto,
    @Param('id', ObjectIdValidationPipe) id: string,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new LikePostCommand(id, userId, status.likeStatus),
    );
  }
}
