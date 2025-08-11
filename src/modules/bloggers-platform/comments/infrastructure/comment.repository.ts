import { InjectModel } from '@nestjs/mongoose';
import {
  CommentDocument,
  CommentModelType,
  Comments,
} from '../domain/comment.domain';
import { NotFoundException } from '@nestjs/common';

export class CommentRepository {
  constructor(
    @InjectModel(Comments.name) private CommentMode: CommentModelType,
  ) {}

  async save(comment: CommentDocument) {
    const { _id } = await comment.save();
    return _id.toString();
  }
  async findCommentByIdOrThrowNotFound(commentId: string) {
    const comment = await this.CommentMode.findOne({
      _id: commentId,
      deletedAt: null,
    });
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }
}
