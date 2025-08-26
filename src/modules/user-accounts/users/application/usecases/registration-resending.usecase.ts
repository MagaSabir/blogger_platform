import { CommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserDocument } from '../../domain/users.domain';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EmailService } from '../../../../notification/email.service';

export class RegistrationResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(RegistrationResendingCommand)
export class RegistrationResendingUseCase {
  constructor(
    private userRepo: UsersRepository,
    private emailService: EmailService,
  ) {}

  async execute(command: RegistrationResendingCommand) {
    const user: UserDocument | null =
      await this.userRepo.findUserByLoginOrEmail(undefined, command.email);
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
    this.emailService.sendConfirmationEmail(user.email, code);
  }
}
