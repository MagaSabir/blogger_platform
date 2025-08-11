import { BaseQueryParams } from '../../../../../core/base-query-params.dto';

export class CommentQueryParams extends BaseQueryParams {
  sortBy: string = 'createdAt';
}
