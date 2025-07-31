import { BaseQueryParams } from '../../../../core/base-query-params.dto';
import { IsOptional, IsString } from 'class-validator';

export class UsersQueryParams extends BaseQueryParams {
  @IsOptional()
  sortBy: string = 'createdAt';
  @IsString()
  @IsOptional()
  searchEmailTerm: string | null = null;
  @IsString()
  @IsOptional()
  searchLoginTerm: string | null = null;
}
