import { InjectModel } from '@nestjs/mongoose';
import {
  LikeComment,
  LikeCommentDocument,
  LikeCommentType,
} from '../domain/like-comment.domain';
import { CreateLikeDto } from '../dto/set-like.dto';
import {
  CommentModelType,
  Comments,
} from '../../../comments/domain/comment.domain';

export class LikeCommentRepository {
  constructor(
    @InjectModel(LikeComment.name) private LikeCommentModel: LikeCommentType,
    @InjectModel(Comments.name) private CommentModel: CommentModelType,
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

  async updateLikesCount(commentId: string) {
    const likes = await this.LikeCommentModel.countDocuments({
      commentId,
      likeStatus: 'Like',
    });
    const dislike = await this.LikeCommentModel.countDocuments({
      commentId,
      likeStatus: 'Dislike',
    });

    await this.CommentModel.updateOne(
      { _id: commentId },
      { $set: { likesCount: likes, dislikesCount: dislike } },
    );
  }
}
