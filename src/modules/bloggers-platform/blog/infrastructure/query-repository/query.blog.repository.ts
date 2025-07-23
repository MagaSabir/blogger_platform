import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../../domain/blog.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogViewDto } from '../../api/blog.view-dto';
import { BlogsQueryParams } from '../../api/input-validation-dto/blogs-query-params';
import { FilterQuery, Types } from 'mongoose';

@Injectable()
export class QueryBlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async getAllBlogs(query: BlogsQueryParams) {
    const filter: FilterQuery<Blog> = { deletedAt: null };
    if (query.searchNameTerm) {
      filter.name = {
        $regex: query.searchNameTerm,
        $options: 'i',
      };
    }
    const skip: number = query.calculateSkip();
    const limit: number = query.pageSize;
    const sort = {
      [query.sortBy ?? 'createdAt']: query.sortDirection ?? 'desc',
    };
    const [blogs, totalCount] = await Promise.all([
      this.blogModel.find(filter).sort(sort).skip(skip).limit(limit),
      this.blogModel.countDocuments(),
    ]);

    const items: BlogViewDto[] = blogs.map(
      (blog: BlogDocument): BlogViewDto => BlogViewDto.mapToView(blog),
    );

    return {
      pageCount: Math.ceil(totalCount / limit),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    };
  }

  async getBlog(id: Types.ObjectId): Promise<BlogViewDto> {
    const blog: BlogDocument | null = await this.blogModel
      .findOne({ _id: id, deletedAt: null })
      .exec();
    if (!blog) {
      throw new NotFoundException('Not found');
    }
    return BlogViewDto.mapToView(blog);
  }
}
