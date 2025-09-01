import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from '../../users/guards/refresh-token/refresh-token-guard';
import { GetRefreshToken } from '../../decorators/get-refresh-token';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllActiveDevicesQuery } from '../application/queries/get-all-active-devices.query';
import { DeleteSessionByIdCommand } from '../application/usecases/delete-session-by-id.usecase';
import { DeleteAllActiveSessionsCommand } from '../application/usecases/delete-all-active-sessions.usecase';

@UseGuards(RefreshTokenGuard)
@Controller('security')
export class SecurityController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}
  @Get('devices')
  getAllActiveDevices(@GetRefreshToken() token: string) {
    return this.queryBus.execute(new GetAllActiveDevicesQuery(token));
  }

  @Delete('devices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSessionByDeviceId(
    @Param('id') deviceId: string,
    @GetRefreshToken() token: string,
  ) {
    await this.commandBus.execute(
      new DeleteSessionByIdCommand(deviceId, token),
    );
  }

  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteActiveAllSessions(@GetRefreshToken() token: string) {
    await this.commandBus.execute(new DeleteAllActiveSessionsCommand(token));
  }
}
