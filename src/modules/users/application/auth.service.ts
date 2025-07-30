import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInputDto } from '../api/input-dto/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { BcryptService } from './bcrypt.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../domain/users.domain';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    private userRepo: UsersRepository,
    private bcryptService: BcryptService,
  ) {}
  async registration(dto: CreateUserInputDto) {
    const existsUser = await this.userRepo.findUserByLoginOrEmail(
      dto.login,
      dto.email,
    );
    if (existsUser) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = await this.bcryptService.hash(dto.password);

    const user = this.userModel.createUser({
      login: dto.login,
      passwordHash,
      email: dto.email,
    });

    const code = uuidv4();

    user.setConfirmationCode(code);
    await user.save();
  }

  async login(dto);
}
