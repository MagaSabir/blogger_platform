import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import { CreatedPostDto } from '../dto/created-post.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostService {
  constructor(
    private postRepo: PostsRepository,
    @InjectModel(Post.name) private PostModel: PostModelType,
  ) {}
  async createPost(dto: CreatedPostDto): Promise<string> {
    const post: PostDocument = this.PostModel.createdPost(dto);
    return this.postRepo.save(post);
  }
}
