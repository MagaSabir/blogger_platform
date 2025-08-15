import { IsEnum } from 'class-validator';
import { LikeStatus } from '../../../likes/dto/like-status.enum';

export class LikeStatusInputDto {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
