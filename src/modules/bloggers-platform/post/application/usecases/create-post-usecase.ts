import { CreatedPostDto } from '../../dto/created-post.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BlogsRepository } from '../../../blog/infrastructure/blogs.repository';
import { NotFoundException } from '@nestjs/common';
import { Post, PostDocument, PostModelType } from '../../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';

export class CreatePostCommand {
  constructor(public dto: CreatedPostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private postRepo: PostsRepository,
    private blogRepo: BlogsRepository,
    @InjectModel(Post.name) private postModel: PostModelType,
  ) {}

  async execute(command: CreatePostCommand) {
    const blog = await this.blogRepo.findBlogById(command.dto.blogId);
    if (!blog) throw new NotFoundException('Blog not found');
    const post: PostDocument = this.postModel.createdPost(
      command.dto,
      blog.name,
    );
    return this.postRepo.save(post);
  }
}
