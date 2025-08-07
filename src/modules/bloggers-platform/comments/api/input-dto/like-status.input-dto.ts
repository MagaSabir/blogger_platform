import { IsEnum } from 'class-validator';

enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

export class LikeStatusInputDto {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
