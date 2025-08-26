import { CreateUserDto } from '../../dto/create-user.dto';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { User, UserDocument, UserModelType } from '../../domain/users.domain';
import { BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BcryptService } from '../service/bcrypt.service';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { v4 as uuidv4 } from 'uuid';

export class RegisterUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private bcryptService: BcryptService,
    private eventBus: EventBus,
    private userRepo: UsersRepository,
  ) {}

  async execute({ dto }: RegisterUserCommand) {
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

    const user: UserDocument = this.UserModel.createUser({
      login: dto.login,
      passwordHash,
      email: dto.email,
    });

    const code = uuidv4();

    user.setConfirmationCode(code);
    await this.userRepo.save(user);

    this.eventBus.publish(new UserRegisteredEvent(user.email, code));
  }
}
