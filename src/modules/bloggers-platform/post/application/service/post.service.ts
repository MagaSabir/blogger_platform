import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { Post, PostDocument, PostModelType } from '../../domain/post.entity';
import { CreatedPostDto } from '../../dto/created-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsRepository } from '../../../blog/infrastructure/blogs.repository';

@Injectable()
export class PostService {
  constructor(
    private postRepo: PostsRepository,
    private blogRepo: BlogsRepository,
    @InjectModel(Post.name) private PostModel: PostModelType,
  ) {}
  async createPost(dto: CreatedPostDto): Promise<string> {
    const blog = await this.blogRepo.findBlogById(dto.blogId);
    if (!blog) throw new NotFoundException('Blog not found');
    const post: PostDocument = this.PostModel.createdPost(dto, blog.name);
    return this.postRepo.save(post);
  }

  async createdPostByBlogId(
    dto: Omit<CreatedPostDto, 'blogId'>,
    blogId: string,
  ) {
    const blog = await this.blogRepo.findBlogById(blogId);
    if (!blog) throw new NotFoundException('Not Found');
    const post: PostDocument = this.PostModel.createdPostByBlogId(
      dto,
      blogId,
      blog.name,
    );
    return this.postRepo.save(post);
  }

  async updatePost(id: string, dto: CreatedPostDto) {
    const post: PostDocument | null = await this.postRepo.findPostById(id);
    if (!post) throw new NotFoundException('Not Found');
    post.updatePost(dto);
    await this.postRepo.save(post);
  }

  async deletePost(id: string) {
    const post: PostDocument | null = await this.postRepo.findPostById(id);
    if (!post) throw new NotFoundException('Not Found');
    post.deletePost();
    await this.postRepo.save(post);
  }
}
