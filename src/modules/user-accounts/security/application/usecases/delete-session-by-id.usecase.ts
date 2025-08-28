import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../../session/infrastructure/session-repository';
import { SessionDocument } from '../../../session/domain/session.domain';
import { ForbiddenException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadType } from '../../types/token-payload.type';

export class DeleteSessionByIdCommand {
  constructor(
    public deviceId: string,
    public token: string,
  ) {}
}

@CommandHandler(DeleteSessionByIdCommand)
export class DeleteSessionByIdUseCase
  implements ICommandHandler<DeleteSessionByIdCommand>
{
  constructor(
    @Inject('REFRESH-TOKEN') private jwtService: JwtService,
    private sessionRepo: SessionRepository,
  ) {}

  async execute(command: DeleteSessionByIdCommand) {
    const session: SessionDocument =
      await this.sessionRepo.findSessionOrThrowNotFoundException(
        command.deviceId,
      );

    const payload: TokenPayloadType = this.jwtService.verify(command.token);

    if (session.userId !== payload.userId) throw new ForbiddenException();

    await this.sessionRepo.deleteSessionById(command.deviceId);
  }
}
