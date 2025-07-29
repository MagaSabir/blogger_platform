import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/users.domain';
import { CreateUserDto } from '../dto/create-user.domain.dto';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private userRepo: UsersRepository,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user: UserDocument = this.UserModel.createUser(dto);
    return this.userRepo.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user: UserDocument | null = await this.userRepo.findUser(id);
    if (!user) throw new NotFoundException('Not Found');
    user.deleteUser();
    await this.userRepo.save(user);
  }
}
