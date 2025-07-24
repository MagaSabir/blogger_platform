import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/users.domain';
import { CreateUserDto } from '../dto/user.dto';
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
}
