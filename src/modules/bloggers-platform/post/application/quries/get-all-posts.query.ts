import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryParams } from '../../api/input-validation-dto/PostsQueryParams';
import { QueryPostRepository } from '../../infrastructure/query-repository/query.post.repository';
import { LikePostRepository } from '../../../likes/posts/infrastructure/like-post.repository';
import { UsersQueryRepository } from '../../../../user-accounts/users/infrastructure/query-repository/users.query-repository';
import { PostViewDto } from './view-dto/post.view-dto';

export class GetAllPostsQuery {
  constructor(
    public queryParam: PostsQueryParams,
    public userId: string,
  ) {}
}

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsQueryHandler
  implements IQueryHandler<GetAllPostsQuery>
{
  constructor(
    private postQueryRepo: QueryPostRepository,
    private postLikeRepo: LikePostRepository,
    private userQueryRepo: UsersQueryRepository,
  ) {}

  async execute(query: GetAllPostsQuery) {
    const { posts, totalCount } = await this.postQueryRepo.getPosts(
      query.queryParam,
      query.userId,
    );

    const postIds: string[] = posts.map((post) => post._id.toString());

    const userLikes = query.userId
      ? await this.postLikeRepo.findLikes(postIds, query.userId)
      : [];
    const allLikes = await this.postLikeRepo.findAllLikes(postIds);

    const allUsersIds: string[] = Array.from(
      new Set(allLikes.map((l) => l.userId.toString())),
    );

    const users =
      allUsersIds.length > 0
        ? await this.userQueryRepo.getUsersByIds(allUsersIds)
        : [];

    const userMap = new Map(users.map((u) => [u._id.toString(), u.login]));

    const items: PostViewDto[] = posts.map((post) => {
      const postId: string = post._id.toString();
      const postLikes = allLikes
        .filter((l) => l.postId.toString() === postId)
        .slice(0, 3)
        .map((l) => ({
          addedAt: l.addedAt.toISOString(),
          userId: l.userId,
          login: userMap.get(l.userId.toString()),
        }));

      const matchedLikes = userLikes.find(
        (l) => l.postId.toString() === postId,
      );
      return PostViewDto.mapToView(post, matchedLikes, postLikes);
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
