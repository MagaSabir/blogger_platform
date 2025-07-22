import { Type } from 'class-transformer';

export class BaseQueryParams {
  @Type(() => Number)
  pageNumber: number = 1;

  @Type(() => Number)
  pageSize: number = 10;

  sortDirection: SortDirection = 'desc';

  calculateSkip(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

export type SortDirection = 'asc' | 'desc';
