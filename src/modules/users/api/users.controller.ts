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
import { CreateUserDto } from '../dto/user.dto';
import { UsersService } from '../application/users.service';
import { UsersQueryParams } from './input-validation-dto/users-query-params';

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
  async createUser(@Body() dto: CreateUserDto) {
    const userId = await this.userService.createUser(dto);
    return await this.userQueryRepo.getUser(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
  }
}
