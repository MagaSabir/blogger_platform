import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreatedPostDto } from '../dto/created-post.dto';
import { PostService } from '../application/post.service';
import { QueryPostRepository } from '../infrastructure/query-repository/query.post.repository';
import { PostViewDto } from './post.view-dto';
import { PostsQueryParams } from './input-validation-dto/PostsQueryParams';

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

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return await this.postQueryRepo.getPostById(id);
  }

  @Get()
  async getPosts(@Query() query: PostsQueryParams) {
    return await this.postQueryRepo.getPosts(query);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param('id') id: string, @Body() dto: CreatedPostDto) {
    return await this.postService.updatePost(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    return await this.postService.deletePost(id);
  }
}
