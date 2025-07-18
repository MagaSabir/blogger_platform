import { Controller, Get, Param } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogDocument } from '../domain/blog.entity';
import { Types } from 'mongoose';

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
}
