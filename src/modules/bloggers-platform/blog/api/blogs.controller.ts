import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { Types } from 'mongoose';
import { CreatedBlogDto, UpdateBlogDto } from '../dto/created-blog.dto';
import { BlogViewDto } from './blog.view';
import { QueryBlogRepository } from '../infrastructure/query-repository/query.blog.repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogService: BlogsService,
    private blogQueryRepo: QueryBlogRepository,
  ) {}
  @Get()
  async getBlogs() {
    return await this.blogQueryRepo.getAllBlogs();
  }

  @Get(':id')
  async getBlogById(@Param('id') id: Types.ObjectId) {
    return await this.blogQueryRepo.getBlog(id);
  }

  @Post()
  async createBlog(@Body() body: CreatedBlogDto) {
    const blog = await this.blogService.createBlog(body);
    return BlogViewDto.mapToView(blog);
  }

  @Put(':id')
  async updateBlog(@Param('id') id: string, @Body() body: UpdateBlogDto) {
    return await this.blogService.updateBlog(id, body);
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id: Types.ObjectId) {
    return await this.blogService.deleteBlog(id);
  }
}
