import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModelType } from '../domain/session.domain';
import { NotFoundException } from '@nestjs/common';
import { sessionCreateDto } from './query-repo/session.query-repository';
import { TokenPayloadType } from '../../security/types/token-payload.type';

export class SessionRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: SessionModelType,
  ) {}

  async createSession(dto: sessionCreateDto) {
    await this.sessionModel.create(dto);
  }

  async updateToken(payload: TokenPayloadType) {
    const { userId, deviceId, iat, exp } = payload;
    await this.sessionModel.updateOne(
      { userId, deviceId },
      { $set: { lastActiveDate: iat, expiration: exp } },
    );
  }

  async deleteSessionById(deviceId: string) {
    await this.sessionModel.deleteOne({ deviceId });
  }

  async findSessionOrThrowNotFoundException(deviceId: string) {
    const session = await this.sessionModel.findOne({ deviceId });
    if (!session) throw new NotFoundException();
    return session;
  }

  async deleteAllActiveSessions(deviceId: string, userId: string) {
    await this.sessionModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }

  async deleteSession(deviceId: string, userId: string) {
    await this.sessionModel.deleteOne({ deviceId, userId });
  }
}
