import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { LikePostRepository } from '../../../likes/posts/infrastructure/like-post.repository';
import { NotFoundException } from '@nestjs/common';
import { UsersQueryRepository } from '../../../../users/infrastructure/query-repository/users.query-repository';
import { PostViewDto } from './view-dto/post.view-dto';

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

  async execute(query: GetPostQuery) {
    const { postId, userId } = query;
    const post = await this.postRepo.findPostById(postId);
    if (!post) throw new NotFoundException();

    const likeStatus = userId
      ? await this.postLikeRepo.findLikeByPostIdAndUser(postId, userId)
      : null;

    const newestLikes = await this.postLikeRepo.findNewest(postId);
    const postIds = newestLikes.map((l) => l.userId);
    const users = await this.userQueryRepo.getUsersByIds(postIds);
    const userMap = new Map(users.map((u) => [u._id.toString(), u.login]));

    const mappedLikes = newestLikes.map((l) => ({
      userId: l.userId,
      login: userMap.get(l.userId.toString()),
      addedAt: l.addedAt,
    }));

    return PostViewDto.mapToView(post, likeStatus, mappedLikes);
  }
}

//TODO fix likesCount and DislikesCount
