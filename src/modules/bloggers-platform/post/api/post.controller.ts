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
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../application/service/post.service';
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

@Controller('posts')
export class PostController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private postService: PostService,
  ) {}
  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() dto: CreateInputPostDto) {
    const postId: string = await this.postService.createPost(dto);
    return await this.queryBus.execute<GetPostQuery, object>(
      new GetPostQuery(postId),
    );
  }

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard)
  async getPostById(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ) {
    const userId = req.user?.id ?? null;
    return await this.queryBus.execute<GetPostQuery, object>(
      new GetPostQuery(id, userId),
    );
  }

  @Get()
  @UseGuards(JwtOptionalAuthGuard)
  async getPosts(
    @Query() query: PostsQueryParams,
    @Req() req: { user: { id: string } },
  ) {
    const userId = req.user?.id ?? null;

    return await this.queryBus.execute<GetAllPostsQuery, object>(
      new GetAllPostsQuery(query, userId),
    );
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param('id') id: string, @Body() dto: CreateInputPostDto) {
    return await this.postService.updatePost(id, dto);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    return await this.postService.deletePost(id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Body() body: CommentInputDto,
    @Param('id', ObjectIdValidationPipe) postId: string,
    @Req() req: { user: { id: string } },
  ) {
    const user: UserViewDto = await this.queryBus.execute<
      GetUserByIdQuery,
      UserViewDto
    >(new GetUserByIdQuery(req.user.id));
    const dto = {
      content: body.content,
      postId: postId,
      user: { userId: req.user.id, userLogin: user.login },
    };
    const commentId: string = await this.commandBus.execute<
      CommentCreateCommand,
      string
    >(new CommentCreateCommand(dto));
    return await this.queryBus.execute<GetCommentQuery, object>(
      new GetCommentQuery(commentId, dto.user.userId),
    );
  }

  @Get(':id/comments')
  @UseGuards(JwtOptionalAuthGuard)
  async getCommentsByPostId(
    @Param('id', ObjectIdValidationPipe) postId: string,
    @Req() req: { user: { id: string } },
    @Query() query: CommentQueryParams,
  ) {
    const userId = req.user?.id ?? null;
    return await this.queryBus.execute<GetAllCommentsByIdQuery, object>(
      new GetAllCommentsByIdQuery(postId, userId, query),
    );
  }

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Body() status: LikeStatusInputDto,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Req() req: { user: { id: string } },
  ) {
    await this.commandBus.execute(
      new LikePostCommand(id, req.user.id, status.likeStatus),
    );
  }
}
