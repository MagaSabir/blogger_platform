import { Type } from 'class-transformer';
import { IsIn, IsNumber } from 'class-validator';

export class BaseQueryParams {
  @Type(() => Number)
  @IsNumber()
  pageNumber: number = 1;

  @Type(() => Number)
  @IsNumber()
  pageSize: number = 10;

  @IsIn(['asc', 'desc'])
  sortDirection: SortDirection = 'desc';

  calculateSkip(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

export type SortDirection = 'asc' | 'desc';
