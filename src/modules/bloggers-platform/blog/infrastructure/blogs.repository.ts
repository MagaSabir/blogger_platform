import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async getBlogs(): Promise<BlogDocument[]> {
    return this.blogModel.find().lean();
  }
  async getBlogById(id: Types.ObjectId): Promise<BlogDocument | null> {
    return this.blogModel.findById(id);
  }
  async save(blog: BlogDocument) {
    return await blog.save();
  }
}
