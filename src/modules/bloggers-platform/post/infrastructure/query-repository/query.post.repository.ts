import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/post.entity';
import { NotFoundException } from '@nestjs/common';
import { QueryBlogRepository } from '../../../blog/infrastructure/query-repository/query.blog.repository';
import { PostsQueryParams } from '../../api/input-validation-dto/PostsQueryParams';

export class QueryPostRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    private blogQueryRepo: QueryBlogRepository,
  ) {}

  async getPosts(query: PostsQueryParams, userId?: string) {
    const filter = { deletedAt: null };
    const limit: number = query.pageSize;

    const sort = {
      [query.sortBy]: query.sortDirection,
    };
    const [posts, totalCount] = await Promise.all([
      this.PostModel.find(filter)
        .sort(sort)
        .skip(query.calculateSkip())
        .limit(limit)
        .lean(),
      this.PostModel.countDocuments(filter),
    ]);

    return {
      posts,
      totalCount,
    };
  }

  async getAllPostsByBlogId(
    id: string,
    query: PostsQueryParams,
    userId?: string,
  ) {
    const blog = await this.blogQueryRepo.getBlog(id);
    if (!blog) throw new NotFoundException('Not Found');
    const filter = { blogId: id, deletedAt: null };
    const limit: number = query.pageSize;
    const sort = {
      [query.sortBy]: query.sortDirection, // заменит createdAt только если null or undefined
    };
    // query.sortBy ? query.sortBy: createdAt

    const [posts, totalCount] = await Promise.all([
      this.PostModel.find(filter)
        .sort(sort)
        .skip(query.calculateSkip())
        .limit(limit)
        .lean(),
      this.PostModel.countDocuments(filter),
    ]);

    return {
      posts,
      totalCount,
    };
  }
}
