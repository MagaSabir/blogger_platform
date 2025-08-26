import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { LikePostRepository } from '../../../likes/posts/infrastructure/like-post.repository';
import { NotFoundException } from '@nestjs/common';
import { UsersQueryRepository } from '../../../../user-accounts/users/infrastructure/query-repository/users.query-repository';
import { PostViewDto } from './view-dto/post.view-dto';
import { LikePostDocument } from '../../../likes/posts/domain/like-post.domain';
import { UserDocument } from '../../../../user-accounts/users/domain/users.domain';

export class GetPostQuery {
  constructor(
    public postId: string,
    public userId?: string,
  ) {}
}

@QueryHandler(GetPostQuery)
export class GetPostQueryHandler implements IQueryHandler<GetPostQuery> {
  constructor(
    private postRepo: PostsRepository,
    private postLikeRepo: LikePostRepository,
    private userQueryRepo: UsersQueryRepository,
  ) {}

  async execute(query: GetPostQuery): Promise<PostViewDto> {
    const { postId, userId } = query;
    const post = await this.postRepo.findPostById(postId);
    if (!post) throw new NotFoundException();

    const likeStatus = userId
      ? await this.postLikeRepo.findLikeByPostIdAndUser(postId, userId)
      : null;

    const newestLikes: LikePostDocument[] =
      await this.postLikeRepo.findNewest(postId);

    const userIds: string[] = newestLikes.map(
      (l: LikePostDocument): string => l.userId,
    );
    const users: UserDocument[] =
      await this.userQueryRepo.getUsersByIds(userIds);
    const userMap = new Map(
      users.map((u: UserDocument): [string, string] => [
        u._id.toString(),
        u.login,
      ]),
    );

    const mappedLikes = newestLikes.map((l) => ({
      userId: l.userId,
      login: userMap.get(l.userId.toString()),
      addedAt: l.addedAt.toISOString(),
    }));

    return PostViewDto.mapToView(post, likeStatus, mappedLikes);
  }
}
