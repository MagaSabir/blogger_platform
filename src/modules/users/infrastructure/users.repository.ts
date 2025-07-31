import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/users.domain';

export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}
  async save(dto: UserDocument): Promise<string> {
    const { _id } = await dto.save();
    return _id.toString();
  }

  async findUser(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ _id: id, deletedAt: null });
  }

  async findUserByLoginOrEmail(login: string, email?: string) {
    return this.UserModel.findOne({
      $or: [{ login }, { email }],
      deletedAt: null,
    });
  }

  async findUserByCode(code: string) {
    return this.UserModel.findOne({ confirmationCode: code, deletedAt: null });
  }
}
