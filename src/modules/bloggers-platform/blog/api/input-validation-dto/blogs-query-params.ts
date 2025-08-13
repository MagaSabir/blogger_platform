import { BaseQueryParams } from '../../../../../core/base-query-params.dto';
import { IsOptional, IsString } from 'class-validator';

export class BlogsQueryParams extends BaseQueryParams {
  @IsString()
  @IsOptional()
  sortBy: string = 'createdAt';
  @IsString()
  @IsOptional()
  searchNameTerm: string | null = null;
}
