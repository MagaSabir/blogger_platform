import { CommentDocument } from '../../../domain/comment.domain';
import { LikeStatus } from '../../../../likes/dto/like-status.enum';
import { Likes } from '../../../../likes/dto/like.type';

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
    likes: Likes | null,
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
