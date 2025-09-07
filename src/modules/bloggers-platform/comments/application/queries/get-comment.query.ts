import { QueryHandler } from '@nestjs/cqrs';
import { CommentQueryRepository } from '../../infrastructure/query/comment.query.repository';
import { CommentViewDto } from './view-dto/comment.view-dto';

export class GetCommentQuery {
  constructor(
    public commentId: string,
    public userId: string,
  ) {}
}

@QueryHandler(GetCommentQuery)
export class GetCommentHandler {
  constructor(private queryRepo: CommentQueryRepository) {}

  async execute(query: GetCommentQuery): Promise<CommentViewDto> {
    return this.queryRepo.getCommentById(query.commentId, query.userId);
  }
}
