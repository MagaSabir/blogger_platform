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
import { BlogsService } from '../application/blogs.service';
import { BlogViewDto } from '../application/quries/view-dto/blog.view-dto';
import { QueryBlogRepository } from '../infrastructure/query-repository/query.blog.repository';
import { BlogsQueryParams } from './input-validation-dto/blogs-query-params';
import { PostsQueryParams } from '../../post/api/input-validation-dto/PostsQueryParams';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';
import { PostViewDto } from '../../post/application/quries/view-dto/post.view-dto';
import { PostService } from '../../post/application/service/post.service';
import { ObjectIdValidationPipe } from '../../../../core/pipes/object-id-validation.pipe';
import { CreateBlogDto } from './input-validation-dto/create-blog.dto';
import { UpdateBlogInputDto } from './input-validation-dto/update-blog.dto';
import { BasicAuthGuard } from '../../../user-accounts/users/guards/basic/basic-auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetPostQuery } from '../../post/application/quries/get-post.query';
import { JwtOptionalAuthGuard } from '../../../user-accounts/users/guards/bearer/Jwt-optional-auth.guard';
import { GetPostByBlogIdQuery } from '../application/quries/get-post-by-id.query';
import { CreatePostByBlogId } from './input-validation-dto/create-post-by-blogId';
import { CreateBlogCommand } from '../application/usecases/create-blog-usecase';
import { UpdateBlogCommand } from '../application/usecases/update-blog-usecase';
import { DeleteBlogCommand } from '../application/usecases/delete-blog-usecase';
import { GetBlogByIdQuery } from '../application/quries/get-blog-by-id.query';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogService: BlogsService,
    private postService: PostService,
    private blogQueryRepo: QueryBlogRepository,
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}
  @Get()
  async getBlogs(
    @Query() query: BlogsQueryParams,
  ): Promise<BasePaginatedResponse<BlogViewDto>> {
    return await this.blogQueryRepo.getAllBlogs(query);
  }

  @Get(':id')
  async getBlogById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<BlogViewDto> {
    return await this.queryBus.execute(new GetBlogByIdQuery(id));
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createBlog(@Body() body: CreateBlogDto): Promise<BlogViewDto> {
    const id: string = await this.commandBus.execute(
      new CreateBlogCommand(body),
    );
    return this.blogQueryRepo.getBlog(id);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: string,
    @Body() body: UpdateBlogInputDto,
  ): Promise<void> {
    await this.commandBus.execute(new UpdateBlogCommand(body, id));
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteBlogCommand(id));
  }

  @Get(':id/posts')
  @UseGuards(JwtOptionalAuthGuard)
  async getPostByBlogId(
    @Param('id') id: string,
    @Query() query: PostsQueryParams,
    @Req() req: { user: { id: string } },
  ): Promise<BasePaginatedResponse<PostViewDto>> {
    const userId: string = req.user?.id ?? null;
    return this.queryBus.execute(new GetPostByBlogIdQuery(id, query, userId));
  }

  @Post(':id/posts')
  @UseGuards(BasicAuthGuard)
  async createPostByBlogId(
    @Body() dto: CreatePostByBlogId,
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ): Promise<PostViewDto> {
    const postId: string = await this.postService.createdPostByBlogId(dto, id);
    return this.queryBus.execute<GetPostQuery, PostViewDto>(
      new GetPostQuery(postId, req.user.id),
    );
  }
}
