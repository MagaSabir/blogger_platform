import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SessionQueryRepository } from '../../../session/infrastructure/query-repo/session.query-repository';
import { TokenPayloadType } from '../../../security/types/token-payload.type';

export class RefreshTokenGuard implements CanActivate {
  constructor(
    private sessionRepo: SessionQueryRepository,
    @Inject('REFRESH-TOKEN') private refreshTokenContext: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token: string = request.cookies['refreshToken'];
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: TokenPayloadType = this.refreshTokenContext.verify(token);
      const session = await this.sessionRepo.getSession(
        payload.userId,
        payload.deviceId,
      );
      if (!session || session.lastActiveDate !== payload.iat) {
        throw new UnauthorizedException('Invalid session');
      }

      (request as any).payload = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException(`Invalid refresh token: ${error}`);
    }
  }
}
