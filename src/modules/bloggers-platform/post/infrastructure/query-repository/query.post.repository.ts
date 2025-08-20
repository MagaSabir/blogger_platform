import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../../domain/post.entity';
import { NotFoundException } from '@nestjs/common';
import { QueryBlogRepository } from '../../../blog/infrastructure/query-repository/query.blog.repository';
import { PostsQueryParams } from '../../api/input-validation-dto/PostsQueryParams';
import { LikePostRepository } from '../../../likes/posts/infrastructure/like-post.repository';
import {
  LikePost,
  LikePostModelType,
} from '../../../likes/posts/domain/like-post.domain';

export class QueryPostRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(LikePost.name) private LikePostModel: LikePostModelType,
    private blogQueryRepo: QueryBlogRepository,
    private likePostRepo: LikePostRepository,
  ) {}
  async getPostById(id: string, userId?: string): Promise<PostDocument | null> {
    return this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    }).lean();
  }
  // if (!post) throw new NotFoundException('Not Found');

  //   const status = userId
  //     ? await this.LikePostModel.findOne({ postId: id, userId }).lean()
  //     : null;
  //
  //   const newestLikes = await this.LikePostModel.find({
  //     postId: id,
  //     likeStatus: 'Like',
  //   })
  //     .sort({ addedAt: -1 })
  //     .limit(3)
  //     .lean();
  //   return PostViewDto.mapPostToView(post, status, newestLikes);
  // }

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

    // const postIds = posts.map((post) => post._id);
    // const userLikes = userId
    //   ? await this.LikePostModel.find({
    //       postId: { $in: postIds },
    //       userId: userId,
    //     }).lean()
    //   : [];
    //
    // const newestLikes = await this.LikePostModel.find({
    //   postId: { $in: postIds },
    //   likeStatus: 'Like',
    // })
    //   .sort({ addedAt: -1 })
    //   .limit(3)
    //   .lean();
    //
    // const items = posts.map((post) => {
    //   const likes = newestLikes.filter(
    //     (l) => l.postId.toString() === post._id.toString(),
    //   );
    //
    //   const likeStatus = userLikes.find(
    //     (l) => l.postId.toString() === post._id.toString(),
    //   );
    //   return PostViewDto.mapToView(post, likeStatus, likes);
    // });
    return {
      // pagesCount: Math.ceil(totalCount / limit),
      // page: query.pageNumber,
      // pageSize: query.pageSize,
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
      // pagesCount: Math.ceil(totalCount / limit),
      // page: query.pageNumber,
      // pageSize: query.pageSize,
      posts,
      totalCount,
    };
  }
}
