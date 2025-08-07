import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserSchema } from '../../../users/domain/users.domain';
import { HydratedDocument, Model } from 'mongoose';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Schema({ timestamps: true })
export class Comments {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({
    required: true,
    type: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
  })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  @Prop({ type: Number, required: true, default: 0 })
  likesCount: number;

  @Prop({ type: Number, required: true, default: 0 })
  dislikesCount: number;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  static createComment(dto: CreateCommentDto) {
    const comment = new this();
    comment.content = dto.content;
    comment.postId = dto.postId;
    comment.commentatorInfo.userId = dto.user.userId;
    comment.commentatorInfo.userLogin = dto.user.userLogin;
    return comment as CommentDocument;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comments);
UserSchema.loadClass(Comments);

export type CommentDocument = HydratedDocument<Comments>;
export type CommentModelType = Model<CommentDocument> & typeof Comments;
