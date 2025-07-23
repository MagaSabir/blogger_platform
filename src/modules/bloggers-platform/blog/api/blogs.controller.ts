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
import { Types } from 'mongoose';
import { CreatedBlogDto, UpdateBlogDto } from '../dto/created-blog.dto';
import { BlogViewDto } from './blog.view-dto';
import { QueryBlogRepository } from '../infrastructure/query-repository/query.blog.repository';
import { BlogsQueryParams } from './input-validation-dto/blogs-query-params';

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
    const id: Types.ObjectId = await this.blogService.createBlog(body);
    return this.blogQueryRepo.getBlog(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: Types.ObjectId,
    @Body() body: UpdateBlogDto,
  ) {
    await this.blogService.updateBlog(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: Types.ObjectId) {
    await this.blogService.deleteBlog(id);
  }
}
