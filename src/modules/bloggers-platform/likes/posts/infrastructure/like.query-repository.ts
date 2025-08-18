import { InjectModel } from '@nestjs/mongoose';
import { LikePost, LikePostModelType } from '../domain/like-post.domain';

export class LikeQueryRepository {
  constructor(
    @InjectModel(LikePost.name) private LikePostModel: LikePostModelType,
  ) {}

  async getUserLike(postId: string, userId: string) {
    return this.LikePostModel.findOne({ postId, userId }).lean();
  }

  async getNewest(postId: string) {
    return this.LikePostModel.find({
      postId,
      likeStatus: 'Like',
    })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
  }
}
