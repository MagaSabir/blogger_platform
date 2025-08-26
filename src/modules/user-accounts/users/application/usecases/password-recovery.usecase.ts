import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { UserDocument } from '../../domain/users.domain';
import { randomUUID } from 'crypto';
import { PasswordRecoveryEvent } from '../events/password-recovery.event';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase {
  constructor(
    private userRepo: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(email: string) {
    const user: UserDocument | null =
      await this.userRepo.findUserByLoginOrEmail(undefined, email);
    if (!user || user.isEmailConfirmed) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'Email  is confirmed',
            field: 'email',
          },
        ],
      });
    }
    const code = randomUUID();
    user.setConfirmationCode(code);
    await this.userRepo.save(user);
    this.eventBus.publish(new PasswordRecoveryEvent(email, code));
  }
}
