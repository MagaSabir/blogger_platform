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

  async execute(command: DeleteCommentCommand): Promise<void> {
    const comment: CommentDocument =
      await this.commentRepo.findCommentByIdOrThrowNotFound(command.commentId);
    if (comment.commentatorInfo.userId !== command.userId) {
      throw new ForbiddenException();
    }
    console.log(comment);
    comment.deletedAt = new Date();
    await comment.save();
  }
}
