import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../domain/blog.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryBlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async getAllBlogs() {}
}
