import { InjectModel } from '@nestjs/mongoose';
import {
  CommentDocument,
  CommentModelType,
  Comments,
} from '../domain/comment.domain';

export class CommentRepository {
  constructor(
    @InjectModel(Comments.name) private CommentMode: CommentModelType,
  ) {}

  async save(comment: CommentDocument) {
    const { _id } = await comment.save();
    return _id.toString();
  }
}
