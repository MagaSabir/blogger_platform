import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../infrastructure/users.repository';
import { BcryptService } from './bcrypt.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../domain/users.domain';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    private userRepo: UsersRepository,
    private bcryptService: BcryptService,
  ) {}

  async validateUser(login: string, password: string) {
    const user = await this.userRepo.findUserByLoginOrEmail(login);
    console.log('DEBUG validateUser', {
      login,
      password,
      userPasswordHash: user?.passwordHash,
    });

    if (!user) {
      return null;
    }
    const hash = user.passwordHash;

    const isPasswordValid = await this.bcryptService.compare(password, hash);

    if (!isPasswordValid) {
      return null;
    }
    return { id: user._id.toString() };
  }
}
