import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { LikeStatus } from '../../dto/like-status.enum';

@Schema()
export class LikePost {
  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, enum: LikeStatus, required: true })
  likeStatus: LikeStatus;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const LikePostSchema = SchemaFactory.createForClass(LikePost);
LikePostSchema.loadClass(LikePost);

export type LikePostDocument = HydratedDocument<LikePost>;
export type LikePostModelType = Model<LikePostDocument> & typeof LikePost;
