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
    const existsUser: UserDocument | null =
      await this.userRepo.findUserByLoginOrEmail(dto.login, dto.email);
    if (existsUser) {
      if (existsUser.login === dto.login) {
        throw new BadRequestException({
          errorsMessages: [
            {
              message: 'Login already exists',
              field: 'login',
            },
          ],
        });
      }
      if (existsUser.email === dto.email) {
        throw new BadRequestException({
          errorsMessages: [
            {
              message: 'Email already exists',
              field: 'email',
            },
          ],
        });
      }
    }

    const passwordHash = await this.bcryptService.hash(dto.password);

    const user = this.userModel.createUser({
      login: dto.login,
      passwordHash,
      email: dto.email,
    });

    const code = uuidv4();

    user.setConfirmationCode(code);
    await this.userRepo.save(user);
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

  login(userId: string) {
    const accessToken = this.jwtService.sign({ userId });

    return { accessToken };
  }

  async confirmation(code: string) {
    const user: UserDocument | null = await this.userRepo.findUserByCode(code);
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

    user.confirmation(code);
    await this.userRepo.save(user);
  }

  async registrationResending(email: string) {
    const user = await this.userRepo.findUserByLoginOrEmail(undefined, email);
    if (!user || user.isEmailConfirmed) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'Email  is confirmed',
            field: 'email',
          },
        ],
      });
    }
    const code = uuidv4();

    user.setConfirmationCode(code);
    await this.userRepo.save(user);
    this.emailService.sendConfirmationEmail(user.email, code);
  }
}
