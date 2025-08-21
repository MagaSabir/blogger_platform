import { BaseQueryParams } from '../../../../../core/base-query-params.dto';
import { IsOptional } from 'class-validator';

export class CommentQueryParams extends BaseQueryParams {
  @IsOptional()
  sortBy: string = 'createdAt';
}
