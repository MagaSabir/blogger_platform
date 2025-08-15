import { IsEnum } from 'class-validator';
import { LikeStatus } from '../../../dto/like-status.enum';

export class InputLikeStatusDto {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
