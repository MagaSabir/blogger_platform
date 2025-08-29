import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../../session/infrastructure/session-repository';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadType } from '../../../security/types/token-payload.type';

export class LogoutCommand {
  constructor(public token: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    @Inject('REFRESH-TOKEN') private refreshTokenContext: JwtService,
    private sessionRepo: SessionRepository,
  ) {}

  async execute(command: LogoutCommand) {
    const payload: TokenPayloadType = this.refreshTokenContext.verify(
      command.token,
    );
    await this.sessionRepo.deleteSession(payload.deviceId, payload.userId);
  }
}
