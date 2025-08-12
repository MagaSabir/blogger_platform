import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeCommentRepository } from '../../../likes/infrastructure/like-comment.repository';
import { LikeCommentDocument } from '../../../likes/domain/like-comment.domain';
import { LikeStatus } from '../../../likes/dto/set-like.dto';

export class SetLikeCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public likeStatus: LikeStatus,
  ) {}
}

@CommandHandler(SetLikeCommand)
export class SetLikeUseCase implements ICommandHandler<SetLikeCommand> {
  constructor(private likeRepo: LikeCommentRepository) {}

  async execute(command: SetLikeCommand) {
    const { commentId, userId, likeStatus } = command;
    const existing: LikeCommentDocument | null =
      await this.likeRepo.findByCommentAndUser(commentId, userId);
    if (existing) {
      if (existing.likeStatus !== likeStatus) {
        existing.likeStatus = likeStatus;
        existing.createdAt = new Date();
        await this.likeRepo.save(existing);
      }
    } else {
      await this.likeRepo.createLike(command);
    }

    await this.likeRepo.updateLikesCount(commentId);
  }
}
