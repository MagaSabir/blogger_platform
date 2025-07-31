import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInputDto } from '../api/input-dto/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { BcryptService } from './bcrypt.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/users.domain';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../notification/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    private userRepo: UsersRepository,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}
  async registration(dto: CreateUserInputDto) {
    const existsUser = await this.userRepo.findUserByLoginOrEmail(
      dto.login,
      dto.email,
    );
    console.log(existsUser);
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
    console.log(user);
    await user.save();
    this.emailService.sendConfirmationEmail(user.email, code);
  }

  async validateUser(login: string, password: string) {
    const user = await this.userRepo.findUserByLoginOrEmail(login);
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

  async login(userId: string) {
    const accessToken = this.jwtService.sign({ userId });

    return { accessToken };
  }

  async confirmation(code: string) {
    const user: UserDocument | null = await this.userRepo.findUserByCode(code);
    console.log(user);
    if (!user) {
      throw new BadRequestException();
    }
    if (user.isEmailConfirmed) {
      throw new BadRequestException('as');
    }

    user.confirmation(code);
    await user.save();
  }
}
