import { CreateCommentDto } from '../../dto/create-comment.dto';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentDocument,
  CommentModelType,
  Comments,
} from '../../domain/comment.domain';
import { CommentRepository } from '../../infrastructure/comment.repository';
import { PostsRepository } from '../../../post/infrastructure/posts.repository';
import { NotFoundException } from '@nestjs/common';

export class CommentCreateCommand {
  constructor(public dto: CreateCommentDto) {}
}

@CommandHandler(CommentCreateCommand)
export class CommentCreateUseCase {
  constructor(
    @InjectModel(Comments.name) private CommentModel: CommentModelType,
    private commentRepo: CommentRepository,
    private postRepo: PostsRepository,
  ) {}
  async execute({ dto }: CommentCreateCommand) {
    const post = await this.postRepo.findPostById(dto.postId);
    if (!post) throw new NotFoundException();
    const comment: CommentDocument = this.CommentModel.createComment(dto);
    return await this.commentRepo.save(comment);
  }
}
