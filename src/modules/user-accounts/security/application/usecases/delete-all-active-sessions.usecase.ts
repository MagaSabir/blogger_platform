import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../../session/infrastructure/session-repository';
import { TokenPayloadType } from '../../types/token-payload.type';

export class DeleteAllActiveSessionsCommand {
  constructor(public token: string) {}
}

@CommandHandler(DeleteAllActiveSessionsCommand)
export class DeleteAllActiveSessionsUseCase
  implements ICommandHandler<DeleteAllActiveSessionsCommand>
{
  constructor(
    @Inject('REFRESH-TOKEN') private jwtService: JwtService,
    private sessionRepo: SessionRepository,
  ) {}

  async execute(command: DeleteAllActiveSessionsCommand) {
    const payload: TokenPayloadType = this.jwtService.verify(command.token);
    await this.sessionRepo.deleteAllActiveSessions(
      payload.deviceId,
      payload.userId,
    );
  }
}
