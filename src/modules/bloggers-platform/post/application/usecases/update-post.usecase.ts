import { UpdatePostDto } from '../../dto/update-post.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../../domain/post.entity';
import { NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdatePostCommand {
  constructor(
    public dto: UpdatePostDto,
    public id: string,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    @InjectModel(Post.name) private postModel: PostModelType,
    private postRepo: PostsRepository,
  ) {}

  async execute(command: UpdatePostCommand) {
    const post: PostDocument | null = await this.postRepo.findPostById(
      command.id,
    );
    if (!post) throw new NotFoundException('Not Found');
    post.updatePost(command.dto);
    await this.postRepo.save(post);
  }
}
