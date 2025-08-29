import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionRepository } from '../../../session/infrastructure/session-repository';
import { TokenPayloadType } from '../../../security/types/token-payload.type';

export class RefreshTokenCommand {
  constructor(public token: string) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    @Inject('ACCESS-TOKEN') private accessTokenContext: JwtService,
    @Inject('REFRESH-TOKEN') private refreshTokenContext: JwtService,
    private sessionRepo: SessionRepository,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: TokenPayloadType = this.refreshTokenContext.verify(
      command.token,
    );
    const { userId, deviceId } = payload;
    const accessToken = this.accessTokenContext.sign({ userId });
    const refreshToken = this.refreshTokenContext.sign({ userId, deviceId });
    const newPayload: TokenPayloadType =
      this.refreshTokenContext.verify(refreshToken);

    await this.sessionRepo.updateToken(newPayload);
    return { accessToken, refreshToken };
  }
}
