import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/service/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query-repository/users.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/users.domain';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './guards/basic/basic.strategy';
import { AuthService } from './application/service/auth.service';
import { AuthController } from './api/auth.controller';
import { BcryptService } from './application/service/bcrypt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './guards/local/local.strategy';
import { AuthQueryRepository } from './infrastructure/query-repository/auth.query-repository';
import { JwtStrategy } from './guards/bearer/jwt-strategy';
import { CreateUserUseCase } from './application/usecases/admins/create-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';
import { LoginUserUseCase } from './application/usecases/login-user.usecase';
import { GetAllUsersQueryHandler } from './application/queries/get-all-users.query';
import { GetUserByIdHandler } from './application/queries/get-user-byId.query';

const refreshTokenConnectionProvider = [
  {
    provide: 'ACCESS-TOKEN',
    useFactory: (): JwtService => {
      return new JwtService({
        secret: 'access-token-secret',
        signOptions: { expiresIn: 10 },
      });
    },
  },

  {
    provide: 'REFRESH-TOKEN',
    useFactory: (): JwtService => {
      return new JwtService({
        secret: 'refresh-secret',
        signOptions: { expiresIn: 10 },
      });
    },
  },
];
const commandHandlers = [
  LoginUserUseCase,
  CreateUserUseCase,
  RegisterUserUseCase,
];
const queryHandler = [GetAllUsersQueryHandler, GetUserByIdHandler];
@Module({
  imports: [
    CqrsModule,
    JwtModule,
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthQueryRepository,
    BasicStrategy,
    AuthService,
    BcryptService,
    LocalStrategy,
    JwtStrategy,
    ...commandHandlers,
    ...refreshTokenConnectionProvider,
    ...queryHandler,
  ],
  exports: [JwtStrategy],
})
export class UsersModule {}
