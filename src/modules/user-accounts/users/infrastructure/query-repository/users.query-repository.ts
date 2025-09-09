import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../../domain/users.domain';
import { UsersQueryParams } from '../../api/input-dto/users-query-params';
import { FilterQuery } from 'mongoose';
import { UserViewDto } from '../../application/queries/view-dto/user.view-dto';
import { Injectable, NotFoundException } from '@nestjs/common';
@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async getUsers(query: UsersQueryParams) {
    const filter: FilterQuery<User> = { deletedAt: null };

    if (query.searchLoginTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        login: { $regex: query.searchLoginTerm, $options: 'i' },
      });
    }

    if (query.searchEmailTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        email: { $regex: query.searchEmailTerm, $options: 'i' },
      });
    }

    const [users, totalCount] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ [query.sortBy]: query.sortDirection })
        .skip(query.calculateSkip())
        .limit(query.pageSize)
        .lean(),
      this.userModel.countDocuments(filter),
    ]);
    console.log(users);
    const items = users.map((u) => UserViewDto.mapToView(u));

    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    };
  }

  async getUser(id: string) {
    const user: UserDocument | null = await this.userModel.findById(id).lean();
    if (!user) throw new NotFoundException('User not found');
    return UserViewDto.mapToView(user);
  }

  async getUsersByIds(userIds: string[]) {
    return this.userModel.find({ _id: { $in: userIds } }, { login: 1 }).lean();
  }
}
