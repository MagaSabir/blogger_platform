import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../users/guards/bearer/jwt-auth.guard';
import { LikeStatusInputDto } from './input-dto/like-status.input-dto';
import { ObjectIdValidationPipe } from '../../../../core/pipes/object-id-validation.pipe';

@Controller('comments')
export class CommentController {
  constructor() {}
  @Put(':id/like-status')
  @UseGuards(JwtAuthGuard)
  async likeStatus(
    @Body() likeStatus: LikeStatusInputDto,
    @Param('id') id: ObjectIdValidationPipe,
  ) {}
}
