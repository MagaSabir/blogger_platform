import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDocument } from '../../../domain/users.domain';
import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../../infrastructure/users.repository';

export class DeleteUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserCase
  implements ICommandHandler<DeleteUserCommand, void>
{
  constructor(private userRepo: UsersRepository) {}
  async execute({ userId }: DeleteUserCommand): Promise<void> {
    const user: UserDocument | null = await this.userRepo.findUser(userId);
    if (!user) throw new NotFoundException('Not Found');
    user.deleteUser();
    await this.userRepo.save(user);
  }
}
