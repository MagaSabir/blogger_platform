export enum LikeStatus {
  LIKE = 'Like',
  DISLIKE = 'Dislike',
  NONE = 'None',
}

export class CreateLikeDto {
  likeStatus: string;
  commentId: string;
  userId: string;
}
