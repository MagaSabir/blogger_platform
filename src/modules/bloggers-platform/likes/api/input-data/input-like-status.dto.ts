import { IsEnum } from 'class-validator';
import { LikeStatus } from '../../dto/set-like.dto';

export class InputLikeStatusDto {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
