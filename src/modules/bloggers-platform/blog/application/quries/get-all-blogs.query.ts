import { BlogsQueryParams } from '../../api/input-validation-dto/blogs-query-params';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QueryBlogRepository } from '../../infrastructure/query-repository/query.blog.repository';

export class GetAllBlogsQuery {
  constructor(public queryParams: BlogsQueryParams) {}
}

@QueryHandler(GetAllBlogsQuery)
export class GetAllBlogsQueryHandler
  implements IQueryHandler<GetAllBlogsQuery>
{
  constructor(private blogsQueryRepo: QueryBlogRepository) {}

  async execute(query: GetAllBlogsQuery) {
    return this.blogsQueryRepo.getAllBlogs(query.queryParams);
  }
}
