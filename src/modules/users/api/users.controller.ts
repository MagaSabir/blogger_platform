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
import { UsersService } from '../application/service/users.service';
import { UsersQueryParams } from './input-dto/users-query-params';
import { CreateUserInputDto } from './input-dto/create-user.dto';
import { ObjectIdValidationPipe } from '../../../core/pipes/object-id-validation.pipe';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/usecases/admins/create-user.usecase';
import { DeleteUserCommand } from '../application/usecases/admins/delete-user.usecase';
import { UserViewDto } from '../application/queries/view-dto/user.view-dto';
import { GetAllUsersQuery } from '../application/queries/get-all-users.query';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private userService: UsersService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private userQueryRepo: UsersQueryRepository,
  ) {}

  @Get()
  async getUsers(@Query() query: UsersQueryParams) {
    return await this.queryBus.execute<GetAllUsersQuery, UserViewDto[]>(
      new GetAllUsersQuery(query),
    );
  }

  @Post()
  async createUser(@Body() dto: CreateUserInputDto): Promise<UserViewDto> {
    const userId: string = await this.commandBus.execute<
      CreateUserCommand,
      string
    >(new CreateUserCommand(dto));
    return await this.userQueryRepo.getUser(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<void> {
    await this.commandBus.execute<DeleteUserCommand>(new DeleteUserCommand(id));
  }
}
