import { InjectModel } from '@nestjs/mongoose';
import {
  LikeComment,
  LikeCommentDocument,
  LikeCommentType,
} from '../domain/like-comment.domain';
import { CreateLikeDto } from '../dto/set-like.dto';

export class LikeCommentRepository {
  constructor(
    @InjectModel(LikeComment.name) private LikeCommentModel: LikeCommentType,
  ) {}

  async findByCommentAndUser(commentId: string, userId: string) {
    return this.LikeCommentModel.findOne({ commentId, userId });
  }

  async save(like: LikeCommentDocument) {
    await like.save();
  }

  async createLike(dto: CreateLikeDto) {
    await this.LikeCommentModel.create(dto);
  }
}
