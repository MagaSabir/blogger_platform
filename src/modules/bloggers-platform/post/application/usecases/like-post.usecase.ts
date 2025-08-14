import { LikeStatus } from '../../../likes/comments/dto/set-like.dto';
import { CommandHandler } from '@nestjs/cqrs';

export class LikePostCommand {
  constructor(public status: LikeStatus) {}
}

@CommandHandler(LikePostCommand)
export class LikePostUseCase {
  constructor(private) {}
}
