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
import { CommentInputDto } from './input-dto/comment-input.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { GetCommentQuery } from '../application/queries/get-comment.query';
import { JwtOptionalAuthGuard } from '../../../users/guards/bearer/Jwt-optional-auth.guard';
import { SetLikeCommand } from '../application/usecases/set-like.usecase';

@Controller('comments')
export class CommentController {
  constructor(
    private commandBus: CommandBus,
    private queryBys: QueryBus,
  ) {}
  @Put(':id/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
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
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Body() body: CommentInputDto,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Req() req: { user: { id: string } },
  ) {
    await this.commandBus.execute(
      new UpdateCommentCommand(body.content, id, req.user.id),
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
  @UseGuards(JwtOptionalAuthGuard)
  async getCommentById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Req() req: { user: { id: string } },
  ) {
    const userId = req.user?.id ?? null;

    return this.queryBys.execute<GetCommentQuery, object>(
      new GetCommentQuery(id, userId),
    );
  }
}
