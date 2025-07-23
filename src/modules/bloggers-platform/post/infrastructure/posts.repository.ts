import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import { ObjectId } from 'mongoose';

export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: PostModelType) {}
  async save(post: PostDocument): Promise<string> {
    const { _id } = await post.save();
    return _id.toString();
  }

  async findPostById(id: ObjectId) {
    return this.postModel.findOne({ _id: id, deletedAt: null });
  }
}
