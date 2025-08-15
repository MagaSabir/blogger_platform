// import { LikeStatus } from '../../dto/like-status.enum';
// import { CommandHandler } from '@nestjs/cqrs';
// import { LikePostRepository } from '../infrastructure/like-post.repository';
// import { LikePostDocument } from '../domain/like-post.domain';
//
// export class LikePostCommand {
//   constructor(
//     public postId: string,
//     public userId: string,
//     public status: LikeStatus,
//   ) {}
// }
//
// @CommandHandler(LikePostCommand)
// export class LikePostUseCase {
//   constructor(private likePostRepo: LikePostRepository) {}
//
//   async execute(command: LikePostCommand) {
//     const { postId, userId, status } = command;
//
//     const existing: LikePostDocument | null =
//       await this.likePostRepo.findLikeByPostIdAndUser(postId, userId);
//     if (existing) {
//       if (existing.likeStatus !== status) {
//         existing.likeStatus = status;
//         existing.createdAt = new Date();
//         await this.likePostRepo.save(existing);
//       }
//     } else {
//       await this.likePostRepo.createLike(command);
//     }
//   }
// }
