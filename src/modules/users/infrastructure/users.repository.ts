import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/users.domain';

export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}
  async save(dto: UserDocument): Promise<string> {
    const { _id } = await dto.save();
    return _id.toString();
  }
}
