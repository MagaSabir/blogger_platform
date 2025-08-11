import { IsString, Length } from 'class-validator';

export class CommentCommentDto {
  @IsString()
  @Length(20, 300)
  content: string;
}
