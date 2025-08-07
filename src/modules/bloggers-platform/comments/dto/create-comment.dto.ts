export class CreateCommentDto {
  content: string;
  postId: string;
  user: { userId: string; userLogin: string };
}
