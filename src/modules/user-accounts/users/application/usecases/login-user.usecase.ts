import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { SessionQueryRepository } from '../../../session/infrastructure/query-repo/session.query-repository';

export class LoginUserCommand {
  constructor(
    public dto: { userId: string },
    public ip: string,
    public userAgent: string,
  ) {}
}
@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    @Inject('ACCESS-TOKEN') private accessTokenContext: JwtService,
    @Inject('REFRESH-TOKEN') private refreshTokenContext: JwtService,
    private sessionRepo: SessionQueryRepository,
  ) {}

  async execute(dto: LoginUserCommand) {
    const deviceId = randomUUID();
    const accessToken = this.accessTokenContext.sign({
      userId: dto.dto.userId,
    });
    const refreshToken = this.refreshTokenContext.sign({
      userId: dto.dto.userId,
      deviceId,
    });
    const payload: {
      userId: string;
      deviceId: string;
      iat: number;
      exp: number;
    } = this.refreshTokenContext.verify(refreshToken);

    const session = {
      userId: dto.dto.userId,
      deviceId,
      userAgent: dto.userAgent,
      ip: dto.ip,
      lastActiveDate: payload.iat,
      expiration: payload.exp,
    };
    await this.sessionRepo.createSession(session);
    return {
      accessToken,
      refreshToken,
    };
  }
}
