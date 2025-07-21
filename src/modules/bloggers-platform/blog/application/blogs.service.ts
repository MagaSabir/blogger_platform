import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateBlogDto } from '../dto/created-blog.dto';

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
    return await this.blogRepo.findBlogById(id);
  }

  async createBlog(dto): Promise<BlogDocument> {
    const blog: BlogDocument = this.BlogModel.createBlog(dto);
    return this.blogRepo.save(blog);
  }

  async updateBlog(id, dto: UpdateBlogDto) {
    const blog = await this.blogRepo.findBlogById(id);
    if (!blog) return new NotFoundException('Not Found');
    blog.updateBlog(dto);
    await this.blogRepo.save(blog);
    return true;
  }

  async deleteBlog(id: Types.ObjectId) {
    const blog = await this.blogRepo.findBlogById(id);
    if (!blog) return new NotFoundException('NotFound');

    blog.deleteBlog();

    await this.blogRepo.save(blog);
  }
}
