import { InjectModel } from '@nestjs/mongoose';
import {
  Session,
  SessionDocument,
  SessionModelType,
} from '../../domain/session.domain';
import { SessionViewDto } from '../../../security/application/queries/view-dto/session-view-dto';

export class SessionQueryRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: SessionModelType,
  ) {}

  async getSession(userId: string, deviceId: string) {
    const session: SessionDocument | null = await this.sessionModel.findOne({
      userId,
      deviceId,
    });
    return session;
  }

  async getAllActiveSessions(userId: string) {
    const session: SessionDocument[] = await this.sessionModel.find({
      userId,
      expiration: { $gt: Math.floor(Date.now() / 1000) },
    });
    return SessionViewDto.mapToView(session);
  }
}

export type sessionCreateDto = {
  userId: string;
  deviceId: string;
  userAgent: string;
  ip: string;
  lastActiveDate: number;
  expiration: number;
};
