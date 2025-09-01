import { CreatePostByBlogId } from '../../dto/create-post.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { PostsRepository } from '../../../post/infrastructure/posts.repository';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelType,
} from '../../../post/domain/post.entity';

export class CreatePostByBlogIdCommand {
  constructor(
    public dto: CreatePostByBlogId,
    public id: string,
  ) {}
}

@CommandHandler(CreatePostByBlogIdCommand)
export class CreatePostByBlogIdUseCase
  implements ICommandHandler<CreatePostByBlogIdCommand>
{
  constructor(
    private blogRepo: BlogsRepository,
    private postRepo: PostsRepository,
    @InjectModel(Post.name) private PostModel: PostModelType,
  ) {}

  async execute(command: CreatePostByBlogIdCommand) {
    const blog = await this.blogRepo.findBlogById(command.id);
    if (!blog) throw new NotFoundException('Not Found');
    const post: PostDocument = this.PostModel.createdPostByBlogId(
      command.dto,
      command.id,
      blog.name,
    );
    return this.postRepo.save(post);
  }
}
