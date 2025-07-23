import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async findBlogById(id: Types.ObjectId): Promise<BlogDocument | null> {
    return this.blogModel.findById(id).exec();
  }
  async save(blog: BlogDocument): Promise<Types.ObjectId> {
    const { _id } = await blog.save();
    return _id;
  }
}
