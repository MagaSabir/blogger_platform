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
      login: string;
    }[];
  };

  static mapToView(
    post: PostDocument,
    likeStatus: LikePostDocument | undefined,
    likes: LikePostDocument[],
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
      newestLikes: likes.map((l) => ({
        addedAt: l.addedAt,
        userId: l.userId,
        login: l.login,
      })),
    };

    return dto;
  }

  static mapPostToView(
    post: PostDocument,
    status: LikePostDocument | null,
    newestLikes: LikePostDocument[],
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
      myStatus: status?.likeStatus ?? LikeStatus.None,
      newestLikes: newestLikes.map((l) => ({
        addedAt: l.addedAt,
        userId: l.userId,
        login: l.login,
      })),
    };
    return dto;
  }
}
