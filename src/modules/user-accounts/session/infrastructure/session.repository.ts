import { InjectModel } from '@nestjs/mongoose';
import {
  Session,
  SessionDocument,
  SessionModelType,
} from '../domain/session.domain';

export class SessionRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: SessionModelType,
  ) {}

  async createSession(dto: sessionCreateDto) {
    await this.sessionModel.create(dto);
  }

  async getSession(
    userId: string,
    deviceId: string,
  ): Promise<SessionDocument | null> {
    return this.sessionModel.findOne({ userId, deviceId });
  }

  async getAllActiveSessions(userId: string) {
    return this.sessionModel.find({
      userId,
      expiration: { $gt: Math.floor(Date.now() / 1000) },
    });
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
