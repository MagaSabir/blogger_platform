import { PostsQueryParams } from '../../../post/api/input-validation-dto/PostsQueryParams';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QueryPostRepository } from '../../../post/infrastructure/query-repository/query.post.repository';
import { LikePostRepository } from '../../../likes/posts/infrastructure/like-post.repository';
import { UsersQueryRepository } from '../../../../users/infrastructure/query-repository/users.query-repository';
import { PostViewDto } from '../../../post/application/quries/view-dto/post.view-dto';

export class GetPostByBlogIdQuery {
  constructor(
    public blogId: string,
    public queryParam: PostsQueryParams,
    public userId: string,
  ) {}
}

@QueryHandler(GetPostByBlogIdQuery)
export class GetPostByBlogIdQueryHandler
  implements IQueryHandler<GetPostByBlogIdQuery>
{
  constructor(
    private postQueryRepo: QueryPostRepository,
    private postLikesRepo: LikePostRepository,
    private userQueryRepo: UsersQueryRepository,
  ) {}

  async execute(query: GetPostByBlogIdQuery) {
    const { posts, totalCount } = await this.postQueryRepo.getAllPostsByBlogId(
      query.blogId,
      query.queryParam,
      query.userId,
    );
    const postIds = posts.map((post) => post._id.toString());
    const userLikes = query.userId
      ? await this.postLikesRepo.findLikes(postIds, query.userId)
      : [];
    const allLikes = await this.postLikesRepo.findAllLikes(postIds);

    const allUsersIds = Array.from(
      new Set(allLikes.map((l) => l.userId.toString())),
    );

    const users =
      allUsersIds.length > 0
        ? await this.userQueryRepo.getUsersByIds(allUsersIds)
        : [];

    const userMap = new Map(users.map((u) => [u._id.toString(), u.login]));

    const items = posts.map((post) => {
      const postId = post._id.toString();
      const newestLikes = allLikes
        .filter((l) => l.postId.toString() === postId)
        .slice(0, 3)
        .map((l) => ({
          addedAt: l.addedAt.toISOString(),
          userId: l.userId,
          login: userMap.get(l.userId.toString()),
        }));

      const matchedLikes = userLikes.find(
        (u) => u.postId.toString() === post._id.toString(),
      );

      return PostViewDto.mapToView(post, matchedLikes, newestLikes);
    });
    return {
      pagesCount: Math.ceil(totalCount / query.queryParam.pageSize),
      page: query.queryParam.pageNumber,
      pageSize: query.queryParam.pageSize,
      totalCount,
      items,
    };
  }
}
