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
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { CreatedBlogDto, UpdateBlogDto } from '../dto/created-blog.dto';
import { BlogViewDto } from './blog.view-dto';
import { QueryBlogRepository } from '../infrastructure/query-repository/query.blog.repository';
import { BlogsQueryParams } from './input-validation-dto/blogs-query-params';
import { QueryPostRepository } from '../../post/infrastructure/query-repository/query.post.repository';
import { PostsQueryParams } from '../../post/api/input-validation-dto/PostsQueryParams';
import { BasePaginatedResponse } from '../../../../core/base-paginated-response';
import { PostViewDto } from '../../post/api/post.view-dto';
import { PostService } from '../../post/application/post.service';
import { CreatedPostDto } from '../../post/dto/created-post.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogService: BlogsService,
    private postService: PostService,
    private blogQueryRepo: QueryBlogRepository,
    private postQueryRepo: QueryPostRepository,
  ) {}
  @Get()
  async getBlogs(
    @Query() query: BlogsQueryParams,
  ): Promise<BasePaginatedResponse<BlogViewDto>> {
    return await this.blogQueryRepo.getAllBlogs(query);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string): Promise<BlogViewDto> {
    return await this.blogQueryRepo.getBlog(id);
  }

  @Post()
  async createBlog(@Body() body: CreatedBlogDto): Promise<BlogViewDto> {
    const id: string = await this.blogService.createBlog(body);
    return this.blogQueryRepo.getBlog(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: string,
    @Body() body: UpdateBlogDto,
  ): Promise<void> {
    await this.blogService.updateBlog(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    await this.blogService.deleteBlog(id);
  }

  @Get(':id/posts')
  async getPostByBlogId(
    @Param('id') id: string,
    @Query() query: PostsQueryParams,
  ): Promise<BasePaginatedResponse<PostViewDto>> {
    return this.postQueryRepo.getAllPostsByBlogId(id, query);
  }

  @Post(':id/posts')
  async createPostByBlogId(
    @Body() dto: Omit<CreatedPostDto, 'blogId'>,
    @Param('id') id: string,
  ) {
    const postId: string = await this.postService.createdPostByBlogId(dto, id);
    return this.postQueryRepo.getPostById(postId);
  }
}
