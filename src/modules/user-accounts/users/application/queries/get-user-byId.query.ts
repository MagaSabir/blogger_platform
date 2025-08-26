import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../infrastructure/query-repository/users.query-repository';

export class GetUserByIdQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private queryRepo: UsersQueryRepository) {}

  async execute(query: GetUserByIdQuery) {
    return this.queryRepo.getUser(query.userId);
  }
}
