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
  LikeCommentDocument,
  LikeCommentType,
} from '../../../likes/comments/domain/like-comment.domain';
import { Post, PostModelType } from '../../../post/domain/post.entity';

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
    const likes: LikeCommentDocument | null = await this.LikeModel.findOne({
      commentId,
      userId,
    });
    return CommentViewDto.mapToView(comment, likes);
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
  ) {
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
    const commentIds = comments.map((l) => l._id.toString());
    const likes = await this.LikeModel.find({
      commentId: { $in: commentIds },
      userId,
    }).lean();

    const comment = comments.map((el) => {
      const matchedLikes = likes.find((l) => l.commentId === el._id.toString());
      return {
        id: el._id.toString(),
        content: el.content,
        commentatorInfo: {
          userId: el.commentatorInfo.userId,
          userLogin: el.commentatorInfo.userLogin,
        },
        createdAt: el.createdAt,
        likesInfo: {
          likesCount: el.likesCount,
          dislikesCount: el.dislikesCount,
          myStatus: matchedLikes ? matchedLikes.likeStatus : 'None',
        },
      };
    });

    return {
      pagesCount: Math.ceil(totalCountPosts / queries.pageSize),
      page: queries.pageNumber,
      pageSize: queries.pageSize,
      totalCount: totalCountPosts,
      items: comment,
    };
  }
}
