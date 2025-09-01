import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import {
  LikePost,
  LikePostModelType,
} from '../../likes/posts/domain/like-post.domain';

export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: PostModelType,
    @InjectModel(LikePost.name) private postLikeModel: LikePostModelType,
  ) {}
  async save(post: PostDocument): Promise<string> {
    const { _id } = await post.save();
    return _id.toString();
  }

  async findPostById(id: string) {
    return this.postModel.findOne({ _id: id, deletedAt: null });
  }

  async updateLikesCount(postId: string) {
    const likes = await this.postLikeModel.countDocuments({
      postId,
      likeStatus: 'Like',
    });
    const dislike = await this.postLikeModel.countDocuments({
      postId,
      likeStatus: 'Dislike',
    });

    await this.postModel.updateOne(
      { _id: postId },
      {
        $set: {
          likesCount: likes,
          dislikesCount: dislike,
        },
      },
    );
  }
}
