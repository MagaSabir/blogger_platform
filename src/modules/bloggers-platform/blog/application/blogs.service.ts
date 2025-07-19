import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { Types } from 'mongoose';
import { CreatedBlogDto } from '../dto/created-blog.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogsService {
  constructor(
    private blogRepo: BlogsRepository,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
  ) {}
  async getAll(): Promise<BlogDocument[]> {
    return await this.blogRepo.getBlogs();
  }
  async getBlogById(id: Types.ObjectId): Promise<BlogDocument | null> {
    return await this.blogRepo.getBlogById(id);
  }

  async createBlog(dto: CreatedBlogDto) {
    const blog: BlogDocument = this.BlogModel.createBlog(dto);
    return this.blogRepo.save(blog);
  }
}
