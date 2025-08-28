import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SessionQueryRepository } from '../../../session/infrastructure/query-repo/session.query-repository';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadType } from '../../types/token-payload.type';
import { SessionViewDto } from './view-dto/session-view-dto';

export class GetAllActiveDevicesQuery {
  constructor(public token: string) {}
}

@QueryHandler(GetAllActiveDevicesQuery)
export class GetAllActiveDevicesQueryHandler
  implements IQueryHandler<GetAllActiveDevicesQuery>
{
  constructor(
    @Inject('REFRESH-TOKEN') private refreshTokenContext: JwtService,
    private sessionQueryRepo: SessionQueryRepository,
  ) {}

  async execute(query: GetAllActiveDevicesQuery): Promise<SessionViewDto[]> {
    const payload: TokenPayloadType = this.refreshTokenContext.verify(
      query.token,
    );
    return this.sessionQueryRepo.getAllActiveSessions(payload.userId);
  }
}
