import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../../domain/post.entity';
import { NotFoundException } from '@nestjs/common';
import { PostViewDto } from '../../api/post.view-dto';
import { QueryBlogRepository } from '../../../blog/infrastructure/query-repository/query.blog.repository';
import { BlogViewDto } from '../../../blog/api/blog.view-dto';
import { PostsQueryParams } from '../../api/input-validation-dto/PostsQueryParams';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';

export class QueryPostRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    private blogQueryRepo: QueryBlogRepository,
  ) {}
  async getPostById(id: string): Promise<PostViewDto> {
    const post: PostDocument | null = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    }).lean();
    if (!post) throw new NotFoundException('Not Found');
    const blog: BlogViewDto = await this.blogQueryRepo.getBlog(
      post.blogId.toString(),
    );
    return PostViewDto.mapToView(post, blog.name);
  }

  async getAllPostsByBlogId(
    id: string,
    query: PostsQueryParams,
  ): Promise<BasePaginatedResponse<PostViewDto>> {
    const filter = { blogId: id, deletedAt: null };
    const skip: number = query.calculateSkip();
    const limit: number = query.pageSize;
    const sort = {
      [query.sortBy ?? 'createdAt']: query.sortDirection ?? 'desc', // заменит createdAt только если null or undefined
    };
    // query.sortBy ? query.sortBy: createdAt

    const [posts, totalCount] = await Promise.all([
      this.PostModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      this.PostModel.countDocuments(filter),
    ]);
    const blog: BlogViewDto = await this.blogQueryRepo.getBlog(id);
    const items: PostViewDto[] = posts.map(
      (post: PostDocument): PostViewDto =>
        PostViewDto.mapToView(post, blog.name),
    );

    return {
      pageCount: Math.ceil(totalCount / limit),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    };
  }
}
