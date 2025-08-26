import { CommandHandler } from '@nestjs/cqrs';
import { BcryptService } from '../service/bcrypt.service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UserDocument } from '../../domain/users.domain';
import { BadRequestException } from '@nestjs/common';

export class NewPasswordCommand {
  constructor(
    public newPassword: string,
    public code: string,
  ) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase {
  constructor(
    private bcryptService: BcryptService,
    private userRepo: UsersRepository,
  ) {}

  async execute(newPassword: string, recoveryCode: string) {
    const user: UserDocument | null =
      await this.userRepo.findUserByCode(recoveryCode);
    if (!user)
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'Email  is confirmed',
            field: 'email',
          },
        ],
      });
    user.passwordHash = await this.bcryptService.hash(newPassword);
    user.isEmailConfirmed = true;
    await this.userRepo.save(user);
  }
}
