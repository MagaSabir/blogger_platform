import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { Types } from 'mongoose';
import { CreatedBlogDto, UpdateBlogDto } from '../dto/created-blog.dto';
import { BlogViewDto } from './blog.view-dto';
import { QueryBlogRepository } from '../infrastructure/query-repository/query.blog.repository';
import { BlogsQueryParams } from './input-validation-dto/blogs-query-params';
import { BlogDocument } from '../domain/blog.entity';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogService: BlogsService,
    private blogQueryRepo: QueryBlogRepository,
  ) {}
  @Get()
  async getBlogs(@Query() query: BlogsQueryParams) {
    return await this.blogQueryRepo.getAllBlogs(query);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: Types.ObjectId): Promise<BlogViewDto> {
    return await this.blogQueryRepo.getBlog(id);
  }

  @Post()
  async createBlog(@Body() body: CreatedBlogDto): Promise<BlogViewDto> {
    const blog: BlogDocument = await this.blogService.createBlog(body);
    return BlogViewDto.mapToView(blog);
  }

  @Put(':id')
  async updateBlog(
    @Param('id') id: Types.ObjectId,
    @Body() body: UpdateBlogDto,
  ) {
    return await this.blogService.updateBlog(id, body);
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id: Types.ObjectId) {
    return await this.blogService.deleteBlog(id);
  }
}
