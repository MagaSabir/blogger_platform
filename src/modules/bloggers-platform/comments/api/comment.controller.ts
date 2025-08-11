import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../users/guards/bearer/jwt-auth.guard';
import { LikeStatusInputDto } from './input-dto/like-status.input-dto';
import { ObjectIdValidationPipe } from '../../../../core/pipes/object-id-validation.pipe';
import { CommentCommentDto } from './input-dto/comment-comment.dto';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';

@Controller('comments')
export class CommentController {
  constructor(private commandBus: CommandBus) {}
  @Put(':id/like-status')
  @UseGuards(JwtAuthGuard)
  async likeStatus(
    @Body() likeStatus: LikeStatusInputDto,
    @Param('id') id: ObjectIdValidationPipe,
  ) {}

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Body() body: CommentCommentDto,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Req() req: { userId: { id: string } },
  ) {
    await this.commandBus.execute(
      new UpdateCommentCommand(body.content, id, req.userId.id),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Req() req: { userId: { id: string } },
  ) {
    await this.commandBus.execute(new DeleteCommentCommand(id, req.userId.id));
  }

  @Get(':id')
  async getCommentById(@Param('id', ObjectIdValidationPipe) id: string) {}
}
