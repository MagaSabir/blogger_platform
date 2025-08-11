import { IsString, Length } from 'class-validator';

export class CommentCommentDto {
  @IsString()
  @Length(2, 300)
  content: string;
}
