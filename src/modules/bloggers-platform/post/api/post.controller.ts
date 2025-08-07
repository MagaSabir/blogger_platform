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

@Controller('posts')
export class PostController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private postQueryRepo: QueryPostRepository,
    private postService: PostService,
  ) {}
  @Post()
  async createPost(@Body() dto: CreateInputBlogDto): Promise<PostViewDto> {
    console.log(dto.blogId);
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
    @Body('content') content: string,
    @Param('id') postId: string,
    @Req() req: { user: { id: string } },
  ) {
    console.log(req.user);
    const user: UserViewDto = await this.queryBus.execute<
      GetUserByIdQuery,
      UserViewDto
    >(new GetUserByIdQuery(req.user.id));
    const dto = {
      content: content,
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
}
