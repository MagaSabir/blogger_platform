import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../domain/blog.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogViewDto } from '../../api/blog.view';

@Injectable()
export class QueryBlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async getAllBlogs() {
    const blogs = await this.blogModel.find({ deletedAt: null }).lean();
    return blogs;
  }

  async getBlog(id) {
    const blog = await this.blogModel
      .findOne({ _id: id, deletedAt: null })
      .exec();
    if (!blog) {
      throw new NotFoundException('Not found');
    }
    return BlogViewDto.mapToView(blog);
  }
}
