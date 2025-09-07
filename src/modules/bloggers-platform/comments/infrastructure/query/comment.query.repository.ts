import { InjectModel } from '@nestjs/mongoose';
import {
  CommentDocument,
  CommentModelType,
  Comments,
} from '../../domain/comment.domain';
import { CommentViewDto } from '../../application/queries/view-dto/comment.view-dto';
import { NotFoundException } from '@nestjs/common';
import { CommentQueryParams } from '../../api/input-dto/CommentQueryParams';
import {
  LikeComment,
  LikeCommentType,
} from '../../../likes/comments/domain/like-comment.domain';
import { Post, PostModelType } from '../../../post/domain/post.entity';
import { BasePaginatedResponse } from '../../../../../core/base-paginated-response';
import { Likes } from '../../../likes/dto/like.type';

export class CommentQueryRepository {
  constructor(
    @InjectModel(Comments.name) private CommentModel: CommentModelType,
    @InjectModel(LikeComment.name) private LikeModel: LikeCommentType,
    @InjectModel(Post.name) private PostModel: PostModelType,
  ) {}
  async getCommentById(commentId: string, userId: string) {
    const comment: CommentDocument | null = await this.CommentModel.findOne({
      _id: commentId,
      deletedAt: null,
    });
    if (!comment) throw new NotFoundException();
    const like: Likes | null = await this.LikeModel.findOne({
      commentId,
      userId,
    }).lean();
    return CommentViewDto.mapToView(comment, like);
  }

  async findCommentOrThrowNotFound(
    commentId: string,
  ): Promise<CommentDocument> {
    const comment: CommentDocument | null = await this.CommentModel.findOne({
      _id: commentId,
      deletedAt: null,
    });
    if (!comment) {
      throw new NotFoundException('Comment Not Found');
    }
    return comment;
  }

  async getComments(
    postId: string,
    userId: string,
    queries: CommentQueryParams,
  ): Promise<BasePaginatedResponse<CommentViewDto>> {
    // const post = await this.PostModel.findOne({ _id: postId });
    // if (!post) throw new NotFoundException();
    const totalCountPosts: number = await this.CommentModel.countDocuments({
      postId: postId,
      deletedAt: null,
    });

    const comments = await this.CommentModel.find({
      postId: postId,
      deletedAt: null,
    })
      .skip((queries.pageNumber - 1) * queries.pageSize)
      .limit(queries.pageSize)
      .sort({ [queries.sortBy]: queries.sortDirection })
      .lean();

    if (comments.length === 0) throw new NotFoundException();
    const commentIds = comments.map((c) => c._id.toString());
    const likes = await this.LikeModel.find({
      commentId: { $in: commentIds },
      userId,
    }).lean();

    const items: CommentViewDto[] = comments.map((comment) => {
      const userLike: Likes | null =
        likes.find((like) => like.commentId === comment._id.toString()) ?? null;

      return CommentViewDto.mapToView(comment, userLike);
    });

    return {
      pagesCount: Math.ceil(totalCountPosts / queries.pageSize),
      page: queries.pageNumber,
      pageSize: queries.pageSize,
      totalCount: totalCountPosts,
      items: items,
    };
  }
}
