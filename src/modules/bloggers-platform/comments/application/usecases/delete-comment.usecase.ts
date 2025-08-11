import { CommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../../infrastructure/comment.repository';
import { CommentDocument } from '../../domain/comment.domain';
import { ForbiddenException } from '@nestjs/common';

export class DeleteCommentCommand {
  constructor(
    public commentId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase {
  constructor(private commentRepo: CommentRepository) {}

  async execute(commentId: string, userId: string) {
    const comment: CommentDocument =
      await this.commentRepo.findCommentByIdOrThrowNotFound(commentId);
    if (comment.commentatorInfo.userId !== userId) {
      throw new ForbiddenException();
    }
    comment.deletedAt = null;
    await comment.save();
  }
}
