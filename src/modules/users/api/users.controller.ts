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
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/query-repository/users.query-repository';
import { UsersService } from '../application/users.service';
import { UsersQueryParams } from './input-dto/users-query-params';
import { CreateUserInputDto } from './input-dto/create-user.dto';
import { ObjectIdValidationPipe } from '../../../core/pipes/object-id-validation.pipe';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/usecases/admins/create-user.usecase';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private userService: UsersService,
    private commandBus: CommandBus,
    private userQueryRepo: UsersQueryRepository,
  ) {}

  @Get()
  async getUsers(@Query() query: UsersQueryParams) {
    console.log(query);
    return await this.userQueryRepo.getUsers(query);
  }

  @Post()
  async createUser(@Body() dto: CreateUserInputDto) {
    const userId: string = await this.commandBus.execute<
      CreateUserCommand,
      string
    >(new CreateUserCommand(dto));
    return await this.userQueryRepo.getUser(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ObjectIdValidationPipe) id: string) {
    await this.userService.deleteUser(id);
  }
}
