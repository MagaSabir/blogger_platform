import { BaseQueryParams } from '../../../../../core/base-query-params.dto';

export class BlogsQueryParams extends BaseQueryParams {
  sortBy: string = 'createdAt';
  searchNameTerm: string | null = null;
}
