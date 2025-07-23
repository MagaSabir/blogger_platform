import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import { ObjectId, Types } from 'mongoose';

export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModelType) {}
  async save(post: PostDocument): Promise<Types.ObjectId> {
    const { _id } = await post.save();
    return _id;
  }

  async findPostById(id: ObjectId) {
    return this.postModel.findOne({ _id: id, deletedAt: null });
  }
}
