import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../infrastructure/query-repository/users.query-repository';
import { UsersQueryParams } from '../../api/input-dto/users-query-params';

export class GetAllUsersQuery {
  constructor(public params: UsersQueryParams) {}
}

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersQueryHandler
  implements IQueryHandler<GetAllUsersQuery>
{
  constructor(private queryRepository: UsersQueryRepository) {}

  async execute(query: GetAllUsersQuery) {
    return this.queryRepository.getUsers(query.params);
  }
}
