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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { GetCommentQuery } from '../application/queries/get-comment.query';
import { SetLikeCommand } from '../application/usecases/set-like.usecase';

@Controller('comments')
export class CommentController {
  constructor(
    private commandBus: CommandBus,
    private queryBys: QueryBus,
  ) {}
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async likeStatus(
    @Body() status: LikeStatusInputDto,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Req() req: { user: { id: string } },
  ) {
    await this.commandBus.execute(
      new SetLikeCommand(id, req.user.id, status.likeStatus),
    );
  }

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
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Req() req: { user: { id: string } },
  ) {
    await this.commandBus.execute(new DeleteCommentCommand(id, req.user.id));
  }

  @Get(':id')
  async getCommentById(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.queryBys.execute<GetCommentQuery, object>(
      new GetCommentQuery(id),
    );
  }
}
