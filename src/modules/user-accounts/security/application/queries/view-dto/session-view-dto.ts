import { SessionDocument } from '../../../../session/domain/session.domain';

export class SessionViewDto {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  static mapToView(sessions: SessionDocument[]) {
    return sessions.map((session) => ({
      ip: session.ip,
      title: session.userAgent,
      lastActiveDate: new Date(session.lastActiveDate * 1000).toISOString(),
      deviceId: session.deviceId,
    }));
  }
}
