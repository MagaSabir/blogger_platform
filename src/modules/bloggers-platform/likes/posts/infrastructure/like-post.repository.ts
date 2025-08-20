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

  async findNewest(postId: string) {
    return this.likePostModel
      .find({ postId, likeStatus: 'Like' })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
  }

  async findLikes(postIds: string[], userId?: string) {
    return this.likePostModel
      .find({
        postId: { $in: postIds },
        userId: userId,
      })
      .lean();
  }

  async findAllLikes(postIds: string[]) {
    return this.likePostModel
      .find({ postId: { $in: postIds }, likeStatus: 'Like' })
      .sort({ addedAt: -1 })
      .lean();
  }
}

export class CreateLikePost {
  postId: string;
  userId: string;
  likeStatus: string;
}
