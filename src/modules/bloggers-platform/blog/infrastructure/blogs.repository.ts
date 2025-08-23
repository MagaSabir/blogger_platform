import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async findBlogById(id: string): Promise<BlogDocument | null> {
    return await this.blogModel.findOne({ _id: id, deletedAt: null }).exec();
  }
  async save(blog: BlogDocument): Promise<string> {
    const { _id } = await blog.save();
    return _id.toString();
  }
}
