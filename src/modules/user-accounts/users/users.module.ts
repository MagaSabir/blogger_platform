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
import { RegistrationResendingUseCase } from './application/usecases/registration-resending.usecase';
import { PasswordRecoveryUseCase } from './application/usecases/password-recovery.usecase';
import { ConfirmationUseCase } from './application/usecases/confirmation.usecase';
import { DeleteUserCase } from './application/usecases/admins/delete-user.usecase';
import { SessionRepository } from '../session/infrastructure/session.repository';
import { Session, SessionSchema } from '../session/domain/session.domain';
import { SecurityController } from '../security/api/security.controller';

const refreshTokenConnectionProvider = [
  {
    provide: 'ACCESS-TOKEN',
    useFactory: (): JwtService => {
      return new JwtService({
        secret: 'access-token-secret',
        signOptions: { expiresIn: '10m' },
      });
    },
  },

  {
    provide: 'REFRESH-TOKEN',
    useFactory: (): JwtService => {
      return new JwtService({
        secret: 'refresh-token-secret',
        signOptions: { expiresIn: '10m' },
      });
    },
  },
];
const commandHandlers = [
  LoginUserUseCase,
  CreateUserUseCase,
  RegisterUserUseCase,
  RegistrationResendingUseCase,
  PasswordRecoveryUseCase,
  ConfirmationUseCase,
  DeleteUserCase,
];
const queryHandler = [GetAllUsersQueryHandler, GetUserByIdHandler];
@Module({
  imports: [
    CqrsModule,
    JwtModule,
    PassportModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [UsersController, AuthController, SecurityController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthQueryRepository,
    SessionRepository,
    BasicStrategy,
    AuthService,
    BcryptService,
    LocalStrategy,
    JwtStrategy,
    ...commandHandlers,
    ...refreshTokenConnectionProvider,
    ...queryHandler,
  ],
  exports: [JwtStrategy, UsersQueryRepository],
})
export class UsersModule {}
