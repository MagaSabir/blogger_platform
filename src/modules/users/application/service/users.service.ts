import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../domain/users.domain';
import { UsersRepository } from '../../infrastructure/users.repository';
import { BcryptService } from './bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private userRepo: UsersRepository,
    private bcryptService: BcryptService,
  ) {}

  // async createUser(dto: CreateUserInputDto) {
  //   const existsUser = await this.userRepo.findUserByLoginOrEmail(
  //     dto.login,
  //     dto.email,
  //   );
  //   if (existsUser) {
  //     throw new BadRequestException('User already exists');
  //   }
  //   const passwordHash = await this.bcryptService.hash(dto.password);
  //
  //   const user: UserDocument = this.UserModel.createUser({
  //     login: dto.login,
  //     passwordHash,
  //     email: dto.email,
  //   });
  //   return this.userRepo.save(user);
  // }

  // async deleteUser(id: string): Promise<void> {
  //   const user: UserDocument | null = await this.userRepo.findUser(id);
  //   if (!user) throw new NotFoundException('Not Found');
  //   user.deleteUser();
  //   await this.userRepo.save(user);
  // }
}
