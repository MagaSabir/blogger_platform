import { CommentDocument } from '../../../domain/comment.domain';

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };

  static mapToView(comment: CommentDocument): CommentViewDto {
    const dto = new CommentViewDto();
    dto.id = comment._id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    };
    dto.createdAt = comment.createdAt.toISOString();
    dto.likesInfo = {
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
      myStatus: 'None',
    };
    return dto;
  }
}
