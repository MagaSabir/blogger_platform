import { CommentDocument } from '../../../domain/comment.domain';
import { LikeCommentDocument } from '../../../../likes/comments/domain/like-comment.domain';
import { LikeStatus } from '../../../../likes/dto/like-status.enum';

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

  static mapToView(
    comment: CommentDocument,
    likes: LikeCommentDocument | null,
  ): CommentViewDto {
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
      myStatus: likes ? likes.likeStatus : LikeStatus.None,
    };
    return dto;
  }
}
