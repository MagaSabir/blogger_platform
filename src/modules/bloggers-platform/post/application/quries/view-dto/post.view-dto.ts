import { PostDocument } from '../../../domain/post.entity';
import { LikeStatus } from '../../../../likes/dto/like-status.enum';
import { LikePostDocument } from '../../../../likes/posts/domain/like-post.domain';

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: {
      addedAt: Date;
      userId: string;
      login: string | undefined;
    }[];
  };

  static mapToView(
    post: PostDocument,
    likeStatus: LikePostDocument | null | undefined,
    mappedLikes: { userId: string; login: string | undefined; addedAt: Date }[],
  ) {
    const dto = new PostViewDto();
    dto.id = post._id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt;
    dto.extendedLikesInfo = {
      likesCount: post.likesCount,
      dislikesCount: post.dislikesCount,
      myStatus: likeStatus?.likeStatus ?? LikeStatus.None,
      newestLikes: mappedLikes,
    };

    return dto;
  }
}
