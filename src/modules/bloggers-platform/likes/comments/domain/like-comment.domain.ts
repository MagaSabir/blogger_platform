import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { LikeStatus } from '../dto/set-like.dto';

@Schema()
export class LikeComment {
  @Prop({ type: String, required: true })
  commentId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, enum: LikeStatus, required: true })
  likeStatus: LikeStatus;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  static setLike;
}

export const LikeSchema = SchemaFactory.createForClass(LikeComment);
LikeSchema.loadClass(LikeComment);

export type LikeCommentDocument = HydratedDocument<LikeComment>;
export type LikeCommentType = Model<LikeComment> & typeof LikeComment;
