import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../../domain/post.entity';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { PostViewDto } from '../../api/post.view-dto';
import { QueryBlogRepository } from '../../../blog/infrastructure/query-repository/query.blog.repository';
import { BlogViewDto } from '../../../blog/api/blog.view-dto';

export class QueryPostRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    private blogQueryRepo: QueryBlogRepository,
  ) {}
  async getPostById(id: Types.ObjectId) {
    const post: PostDocument | null = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    }).lean();
    if (!post) throw new NotFoundException('Not Found');
    const blog: BlogViewDto = await this.blogQueryRepo.getBlog(post.blogId);
    return PostViewDto.mapToView(post, blog.name);
  }
}
