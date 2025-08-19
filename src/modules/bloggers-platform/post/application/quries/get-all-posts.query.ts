import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostsQueryParams } from '../../api/input-validation-dto/PostsQueryParams';
import { QueryPostRepository } from '../../infrastructure/query-repository/query.post.repository';
import { PostDocument } from '../../domain/post.entity';
import { LikePostRepository } from '../../../likes/posts/infrastructure/like-post.repository';

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
  ) {}

  async execute(query: GetAllPostsQuery) {
    const posts: PostDocument[] = await this.postQueryRepo.getPosts(
      query.queryParam,
      query.userId,
    );

    const postIds = posts.map((post) => post._id);
    const likeStatus = userId
      ? await this.postLikeRepo.findLikeByPostIdAndUser(postId, userId)
      : null;
  }
}
