import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogDocument } from '../domain/blog.entity';
import { Types } from 'mongoose';
import { CreatedBlogDto } from '../dto/created-blog.dto';
import { BlogViewDto } from './blog.view';

@Controller('blogs')
export class BlogsController {
  constructor(private blogService: BlogsService) {}
  @Get()
  async getBlogs(): Promise<BlogDocument[]> {
    return await this.blogService.getAll();
  }

  @Get(':id')
  async getBlogById(
    @Param('id') id: Types.ObjectId,
  ): Promise<BlogDocument | null> {
    return await this.blogService.getBlogById(id);
  }

  @Post()
  async createBlog(@Body() body: CreatedBlogDto) {
    const blog: BlogDocument = await this.blogService.createBlog(body);
    return BlogViewDto.mapToView(blog);
  }
}
