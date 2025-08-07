import { InjectModel } from '@nestjs/mongoose';
import { CommentModelType, Comments } from '../../domain/comment.domain';

export class CommentQueryRepository {
  constructor(
    @InjectModel(Comments.name) private CommentModel: CommentModelType,
  ) {}
  async getCommentById(commentId: string) {
    const comment = await this.CommentModel.findById(commentId);
    console.log(comment);

    if (!comment) return null;
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      likesInfo: {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus: 'None',
      },
    };
  }
}
