import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/query-repository/users.query-repository';
import { UsersService } from '../application/users.service';
import { UsersQueryParams } from './input-dto/users-query-params';
import { CreateUserInputDto, IdInputDto } from './input-dto/create-user.dto';
import { ObjectIdValidationPipe } from '../../../core/pipes/object-id-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private userQueryRepo: UsersQueryRepository,
  ) {}

  @Get()
  async getUsers(@Query() query: UsersQueryParams) {
    return await this.userQueryRepo.getUsers(query);
  }

  @Post()
  async createUser(@Body() dto: CreateUserInputDto) {
    const userId = await this.userService.createUser(dto);
    return await this.userQueryRepo.getUser(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ObjectIdValidationPipe) id: string) {
    await this.userService.deleteUser(id);
  }
}
