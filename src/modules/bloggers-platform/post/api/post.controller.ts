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
import { CreatedPostDto } from '../dto/created-post.dto';
import { PostService } from '../application/service/post.service';
import { QueryPostRepository } from '../infrastructure/query-repository/query.post.repository';
import { PostViewDto } from './post.view-dto';
import { PostsQueryParams } from './input-validation-dto/PostsQueryParams';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CommentCreateCommand } from '../../comments/application/usecases/comment-create.usecase';
import { JwtAuthGuard } from '../../../users/guards/bearer/jwt-auth.guard';
import { GetUserByIdQuery } from '../../../users/application/queries/get-user-byId.query';
import { UserViewDto } from '../../../users/application/queries/view-dto/user.view-dto';
import { GetCommentQuery } from '../../comments/application/queries/get-comment.query';
import { CreateInputBlogDto } from './input-validation-dto/create-blog.input.dto';
import { CommentCommentDto } from '../../comments/api/input-dto/comment-comment.dto';
import { ObjectIdValidationPipe } from '../../../../core/pipes/object-id-validation.pipe';
import { CommentQueryParams } from '../../comments/api/input-dto/CommentQueryParams';
import { GetAllCommentsByIdQuery } from '../../comments/application/queries/get-all-comments-by-id.query';
import { CommentQueryRepository } from '../../comments/infrastructure/query/comment.query.repository';

@Controller('posts')
export class PostController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private postQueryRepo: QueryPostRepository,
    private postService: PostService,
    private queryComment: CommentQueryRepository,
  ) {}
  @Post()
  async createPost(@Body() dto: CreateInputBlogDto): Promise<PostViewDto> {
    const postId: string = await this.postService.createPost(dto);
    return await this.postQueryRepo.getPostById(postId);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return await this.postQueryRepo.getPostById(id);
  }

  @Get()
  async getPosts(@Query() query: PostsQueryParams) {
    return await this.postQueryRepo.getPosts(query);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param('id') id: string, @Body() dto: CreatedPostDto) {
    return await this.postService.updatePost(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    return await this.postService.deletePost(id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Body() body: CommentCommentDto,
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
      new GetCommentQuery(commentId),
    );
  }

  @Get(':id/comments')
  @UseGuards(JwtAuthGuard)
  async getCommentsByPostId(
    @Param('id', ObjectIdValidationPipe) postId: string,
    @Req() req: { user: { id: string } },
    @Query() query: CommentQueryParams,
  ) {
    const userId = req.user?.id ?? null;
    console.log(userId);
    return await this.queryBus.execute<GetAllCommentsByIdQuery, object>(
      new GetAllCommentsByIdQuery(postId, userId, query),
    );
  }
}
