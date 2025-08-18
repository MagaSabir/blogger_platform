import { LikeStatus } from '../../../likes/dto/like-status.enum';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { NotFoundException } from '@nestjs/common';
import { LikePostRepository } from '../../../likes/posts/infrastructure/like-post.repository';
import { LikePostDocument } from '../../../likes/posts/domain/like-post.domain';

export class LikePostCommand {
  constructor(
    public postId: string,
    public userId: string,
    public likeStatus: LikeStatus,
  ) {}
}

@CommandHandler(LikePostCommand)
export class LikePostUseCase implements ICommandHandler<LikePostCommand> {
  constructor(
    private postRepo: PostsRepository,
    private postLikeRepo: LikePostRepository,
  ) {}

  async execute(command: LikePostCommand) {
    const { postId, userId, likeStatus } = command;

    const post = await this.postRepo.findPostById(postId);

    if (!post) throw new NotFoundException();

    const existing: LikePostDocument | null =
      await this.postLikeRepo.findLikeByPostIdAndUser(postId, userId);

    if (existing) {
      if (existing.likeStatus !== likeStatus) {
        existing.likeStatus = likeStatus;
        existing.addedAt = new Date();
        await this.postLikeRepo.save(existing);
      }
    } else {
      await this.postLikeRepo.createLike(command);
    }

    await this.postLikeRepo.updateLikesCount(postId);
  }
}
