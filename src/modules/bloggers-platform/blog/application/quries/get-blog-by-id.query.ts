import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QueryBlogRepository } from '../../infrastructure/query-repository/query.blog.repository';

export class GetBlogByIdQuery {
  constructor(public id: string) {}
}

@QueryHandler(GetBlogByIdQuery)
export class GetBlogByIdQueryHandler
  implements IQueryHandler<GetBlogByIdQuery>
{
  constructor(private queryBlogRepo: QueryBlogRepository) {}
  async execute(query: GetBlogByIdQuery) {
    return this.queryBlogRepo.getBlog(query.id);
  }
}
