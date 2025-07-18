import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogDocument } from '../domain/blog.entity';
import { Types } from 'mongoose';

@Injectable()
export class BlogsService {
  constructor(private blogRepo: BlogsRepository) {}
  async getAll(): Promise<BlogDocument[]> {
    return await this.blogRepo.getBlogs();
  }
  async getBlogById(id: Types.ObjectId): Promise<BlogDocument | null> {
    return await this.blogRepo.getBlogById(id);
  }
}
