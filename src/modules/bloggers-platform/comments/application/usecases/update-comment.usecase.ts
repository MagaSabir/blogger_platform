import { CommandHandler } from '@nestjs/cqrs';
import { CommentQueryRepository } from '../../infrastructure/query/comment.query.repository';
import { CommentDocument } from '../../domain/comment.domain';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class UpdateCommentCommand {
  constructor(
    public content: string,
    public commentId: string,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase {
  constructor(private queryRepo: CommentQueryRepository) {}

  async execute(command: UpdateCommentCommand) {
    const comment: CommentDocument =
      await this.queryRepo.findCommentOrThrowNotFound(command.commentId);

    if (!comment) throw new NotFoundException();
    if (comment.commentatorInfo.userId !== command.userId) {
      throw new ForbiddenException();
    }

    comment.content = command.content;
    await comment.save();
  }
}
