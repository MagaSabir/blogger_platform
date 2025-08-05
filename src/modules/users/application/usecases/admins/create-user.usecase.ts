import { CreateUserDto } from '../../../dto/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelType,
} from '../../../domain/users.domain';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { BcryptService } from '../../bcrypt.service';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand, string>
{
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
  ) {}
  async execute({ dto }: CreateUserCommand): Promise<string> {
    const existsUser: UserDocument | null =
      await this.usersRepository.findUserByLoginOrEmail(dto.login, dto.email);
    if (existsUser) {
      throw new BadRequestException('User already exists');
    }
    const passwordHash: string = await this.bcryptService.hash(dto.password);
    const user: UserDocument = await this.UserModel.create({
      login: dto.login,
      passwordHash,
      email: dto.email,
    });
    return await this.usersRepository.save(user);
  }
}
