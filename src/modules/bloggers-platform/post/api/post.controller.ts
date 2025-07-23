import { Body, Controller, Post } from '@nestjs/common';
import { CreatedPostDto } from '../dto/created-post.dto';
import { PostService } from '../application/post.service';
import { QueryPostRepository } from '../infrastructure/query-repository/query.post.repository';
import { PostViewDto } from './post.view-dto';

@Controller('posts')
export class PostController {
  constructor(
    private postQueryRepo: QueryPostRepository,
    private postService: PostService,
  ) {}
  @Post()
  async createPost(@Body() dto: CreatedPostDto): Promise<PostViewDto> {
    const postId: string = await this.postService.createPost(dto);
    return await this.postQueryRepo.getPostById(postId);
  }
}
