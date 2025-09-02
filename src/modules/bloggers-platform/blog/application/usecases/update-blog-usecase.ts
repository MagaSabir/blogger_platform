import { UpdateBlogDto } from '../../dto/created-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { BlogDocument } from '../../domain/blog.entity';
import { NotFoundException } from '@nestjs/common';

export class UpdateBlogCommand {
  constructor(
    public dto: UpdateBlogDto,
    public id: string,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogRepo: BlogsRepository) {}

  async execute(command: UpdateBlogCommand) {
    const blog: BlogDocument | null = await this.blogRepo.findBlogById(
      command.id,
    );
    if (!blog) throw new NotFoundException('Not Found');
    blog.updateBlog(command.dto);
    await this.blogRepo.save(blog);
  }
}
