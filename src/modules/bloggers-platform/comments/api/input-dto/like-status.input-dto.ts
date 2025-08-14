import { IsEnum } from 'class-validator';
import { LikeStatus } from '../../../likes/comments/dto/set-like.dto';

export class LikeStatusInputDto {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
