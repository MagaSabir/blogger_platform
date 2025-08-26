import { CommandHandler } from '@nestjs/cqrs';
import { UserDocument } from '../../domain/users.domain';
import { BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/users.repository';

export class ConfirmationCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmationCommand)
export class ConfirmationUseCase {
  constructor(private userRepo: UsersRepository) {}
  async execute(command: ConfirmationCommand) {
    const user: UserDocument | null = await this.userRepo.findUserByCode(
      command.code,
    );
    if (!user || user.isEmailConfirmed) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'Email  is confirmed or not found',
            field: 'code',
          },
        ],
      });
    }

    user.confirmation(command.code);
    await this.userRepo.save(user);
  }
}
