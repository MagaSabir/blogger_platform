import { LikeStatus } from './like-status.enum';

export type Likes = {
  commentId: string;
  userId: string;
  likeStatus: LikeStatus;
  createdAt: Date;
};
