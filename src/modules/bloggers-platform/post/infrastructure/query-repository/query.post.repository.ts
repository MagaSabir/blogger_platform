import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../../domain/post.entity';
import { NotFoundException } from '@nestjs/common';
import { PostViewDto } from '../../application/quries/view-dto/post.view-dto';
import { QueryBlogRepository } from '../../../blog/infrastructure/query-repository/query.blog.repository';
import { PostsQueryParams } from '../../api/input-validation-dto/PostsQueryParams';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { LikePostRepository } from '../../../likes/posts/infrastructure/like-post.repository';
import { LikePostDocument } from '../../../likes/posts/domain/like-post.domain';

export class QueryPostRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    private blogQueryRepo: QueryBlogRepository,
    private likePostRepo: LikePostRepository,
  ) {}
  async getPostById(id: string, userId: string): Promise<PostViewDto> {
    const post: PostDocument | null = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    }).lean();
    if (!post) throw new NotFoundException('Not Found');

    const likes: LikePostDocument | null =
      await this.likePostRepo.findLikeByPostIdAndUser(id, userId);

    return PostViewDto.mapToView(post, likes);
  }

  async getPosts(query: PostsQueryParams) {
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

    // const likes: LikePostDocument | null =
    //   await this.likePostRepo.findLikeByPostIdAndUser();

    const items = posts.map((post: PostDocument) =>
      PostViewDto.mapToView(post, likes),
    );

    return {
      pagesCount: Math.ceil(totalCount / limit),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    };
  }

  async getAllPostsByBlogId(
    id: string,
    query: PostsQueryParams,
  ): Promise<BasePaginatedResponse<PostViewDto>> {
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
    const items = posts.map((p) => PostViewDto.mapToView(p));

    return {
      pagesCount: Math.ceil(totalCount / limit),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    };
  }
}
