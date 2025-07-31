import { UsersRepository } from '../users.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
@Injectable()
export class AuthQueryRepository {
  constructor(private userRepo: UsersRepository) {}
  async getUser(userId: string) {
    const user = await this.userRepo.findUser(userId);
    if (!user) {
      throw new NotFoundException();
    }
    return {
      login: user.login,
      email: user.email,
      userId: user._id.toString(),
    };
  }
}
