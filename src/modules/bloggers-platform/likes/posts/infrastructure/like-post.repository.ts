import { InjectModel } from '@nestjs/mongoose';
import {
  LikePost,
  LikePostDocument,
  LikePostModelType,
} from '../domain/like-post.domain';

export class LikePostRepository {
  constructor(
    @InjectModel(LikePost.name) private likePostModel: LikePostModelType,
  ) {}

  async findLikeByPostIdAndUser(postId: string, userId: string) {
    return this.likePostModel.findOne({ postId, userId });
  }

  async save(existing: LikePostDocument) {
    await existing.save();
  }

  async createLike(dto: CreateLikePost) {
    await this.likePostModel.create(dto);
  }

  async updateLikesCount(postId: string) {
    const likes = await this.likePostModel.countDocuments({
      postId,
      likeStatus: 'Like',
    });
    const dislike = await this.likePostModel.countDocuments({
      postId,
      likeStatus: 'Dislike',
    });

    await this.likePostModel.updateOne(
      { _id: postId },
      { $set: { likesCount: likes, dislikesCount: dislike } },
    );
  }
}

export class CreateLikePost {
  postId: string;
  userId: string;
  likeStatus: string;
}
