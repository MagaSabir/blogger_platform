import { InjectModel } from '@nestjs/mongoose';
import {
  CommentDocument,
  CommentModelType,
  Comments,
} from '../../domain/comment.domain';
import { CommentViewDto } from '../../application/queries/view-dto/comment.view-dto';

export class CommentQueryRepository {
  constructor(
    @InjectModel(Comments.name) private CommentModel: CommentModelType,
  ) {}
  async getCommentById(commentId: string) {
    const comment: CommentDocument | null =
      await this.CommentModel.findById(commentId);

    if (!comment) return null;
    return CommentViewDto.mapToView(comment);
  }
}
