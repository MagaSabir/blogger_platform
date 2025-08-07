import { QueryHandler } from '@nestjs/cqrs';
import { CommentQueryRepository } from '../../infrastructure/query/comment.query.repository';

export class GetCommentQuery {
  constructor(public commentId: string) {}
}

@QueryHandler(GetCommentQuery)
export class GetCommentHandler {
  constructor(private queryRepo: CommentQueryRepository) {}

  async execute(query: GetCommentQuery) {
    return this.queryRepo.getCommentById(query.commentId);
  }
}
