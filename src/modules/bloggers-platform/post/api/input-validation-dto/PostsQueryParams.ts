import { BaseQueryParams } from '../../../../../core/base-query-params.dto';

export class PostsQueryParams extends BaseQueryParams {
  sortBy: string = 'createdAt';
}
