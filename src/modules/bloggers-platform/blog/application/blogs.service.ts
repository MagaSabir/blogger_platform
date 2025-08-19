import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreatedBlogDto, UpdateBlogDto } from '../dto/created-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    private blogRepo: BlogsRepository,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
  ) {}

  async createBlog(dto: CreatedBlogDto): Promise<string> {
    const blog: BlogDocument = this.BlogModel.createBlog(dto);
    return this.blogRepo.save(blog);
  }

  async updateBlog(id: string, dto: UpdateBlogDto): Promise<void> {
    const blog: BlogDocument | null = await this.blogRepo.findBlogById(id);
    if (!blog) throw new NotFoundException('Not Found');
    blog.updateBlog(dto);
    await this.blogRepo.save(blog);
  }

  async deleteBlog(id: string): Promise<void> {
    const blog: BlogDocument | null = await this.blogRepo.findBlogById(id);
    if (!blog) throw new NotFoundException('Not Found');

    blog.deleteBlog();

    await this.blogRepo.save(blog);
  }
}
