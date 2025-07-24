import { BaseQueryParams } from '../../../../core/base-query-params.dto';

export class UsersQueryParams extends BaseQueryParams {
  sortBy: string = 'createdAt';
  searchEmailTerm: string | null = null;
  searchLoginTerm: string | null = null;
}
