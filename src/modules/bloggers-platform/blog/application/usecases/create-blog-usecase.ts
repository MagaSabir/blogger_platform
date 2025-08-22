import { CreateBlogDto } from '../../api/input-validation-dto/create-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../../domain/blog.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class CreateBlogCommand {
  constructor(public dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
  implements ICommandHandler<CreateBlogCommand, string>
{
  constructor(
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    private blogRepo: BlogsRepository,
  ) {}
  async execute(command: CreateBlogCommand) {
    const blog: BlogDocument = this.BlogModel.createBlog(command.dto);
    return this.blogRepo.save(blog);
  }
}
