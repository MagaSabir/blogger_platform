import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim';

export class CommentInputDto {
  @IsString()
  @Trim()
  @Length(20, 300)
  content: string;
}
