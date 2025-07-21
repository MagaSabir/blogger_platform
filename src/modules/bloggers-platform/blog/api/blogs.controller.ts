import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogDocument } from '../domain/blog.entity';
import { Types } from 'mongoose';
import { CreatedBlogDto } from '../dto/created-blog.dto';
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
    const blog: BlogDocument = await this.blogService.createBlog(body);
    return BlogViewDto.mapToView(blog);
  }
}
