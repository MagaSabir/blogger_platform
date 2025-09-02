import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogDocument } from '../../domain/blog.entity';
import { NotFoundException } from '@nestjs/common';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogRepo: BlogsRepository) {}

  async execute(command: DeleteBlogCommand) {
    const blog: BlogDocument | null = await this.blogRepo.findBlogById(
      command.id,
    );
    if (!blog) throw new NotFoundException('Not Found');

    blog.deleteBlog();

    await this.blogRepo.save(blog);
  }
}
