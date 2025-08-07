import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateInputBlogDto {
  @IsString()
  @Length(1, 30)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;

  @IsString()
  blogId: string;
}
