import { QueryHandler } from '@nestjs/cqrs';
import { CommentQueryRepository } from '../../infrastructure/query/comment.query.repository';
import { CommentQueryParams } from '../../api/input-dto/CommentQueryParams';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { CommentViewDto } from './view-dto/comment.view-dto';

export class GetAllCommentsByIdQuery {
  constructor(
    public commentId: string,
    public userId: string,
    public queries: CommentQueryParams,
  ) {}
}

@QueryHandler(GetAllCommentsByIdQuery)
export class GetAllCommentByIdHandler {
  constructor(private queryCommentRepo: CommentQueryRepository) {}

  async execute(
    query: GetAllCommentsByIdQuery,
  ): Promise<BasePaginatedResponse<CommentViewDto>> {
    return this.queryCommentRepo.getComments(
      query.commentId,
      query.userId,
      query.queries,
    );
  }
}
