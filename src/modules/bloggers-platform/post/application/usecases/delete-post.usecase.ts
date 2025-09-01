import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PostDocument } from '../../domain/post.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class DeletePostCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUserCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postRepo: PostsRepository) {}

  async execute(command: DeletePostCommand) {
    const post: PostDocument | null = await this.postRepo.findPostById(
      command.id,
    );
    if (!post) throw new NotFoundException('Not Found');
    post.deletePost();
    await this.postRepo.save(post);
  }
}
