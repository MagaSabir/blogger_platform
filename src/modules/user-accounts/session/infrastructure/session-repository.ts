import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModelType } from '../domain/session.domain';
import { NotFoundException } from '@nestjs/common';

export class SessionRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: SessionModelType,
  ) {}

  async deleteSessionById(deviceId: string) {
    await this.sessionModel.deleteOne({ deviceId });
  }

  async findSessionOrThrowNotFoundException(deviceId: string) {
    const session = await this.sessionModel.findOne({ deviceId });
    if (!session) throw new NotFoundException();
    return session;
  }
}
