import { Module } from '@nestjs/common';
import { UsersController } from './users/api/users.controller';
import { UsersService } from './users/application/service/users.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import { UsersQueryRepository } from './users/infrastructure/query-repository/users.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/domain/users.domain';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './users/guards/basic/basic.strategy';
import { AuthService } from './users/application/service/auth.service';
import { AuthController } from './users/api/auth.controller';
import { BcryptService } from './users/application/service/bcrypt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './users/guards/local/local.strategy';
import { AuthQueryRepository } from './users/infrastructure/query-repository/auth.query-repository';
import { JwtStrategy } from './users/guards/bearer/jwt-strategy';
import { CreateUserUseCase } from './users/application/usecases/admins/create-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterUserUseCase } from './users/application/usecases/register-user.usecase';
import { LoginUserUseCase } from './users/application/usecases/login-user.usecase';
import { GetAllUsersQueryHandler } from './users/application/queries/get-all-users.query';
import { GetUserByIdHandler } from './users/application/queries/get-user-byId.query';
import { RegistrationResendingUseCase } from './users/application/usecases/registration-resending.usecase';
import { PasswordRecoveryUseCase } from './users/application/usecases/password-recovery.usecase';
import { ConfirmationUseCase } from './users/application/usecases/confirmation.usecase';
import { DeleteUserCase } from './users/application/usecases/admins/delete-user.usecase';
import { Session, SessionSchema } from './session/domain/session.domain';
import { SecurityController } from './security/api/security.controller';
import { SessionQueryRepository } from './session/infrastructure/query-repo/session.query-repository';
import { GetAllActiveDevicesQueryHandler } from './security/application/queries/get-all-active-devices.query';
import { DeleteSessionByIdUseCase } from './security/application/usecases/delete-session-by-id.usecase';
import { SessionRepository } from './session/infrastructure/session-repository';
import { DeleteAllActiveSessionsUseCase } from './security/application/usecases/delete-all-active-sessions.usecase';
import { RefreshTokenUseCase } from './users/application/usecases/refresh-token.usecase';
import { LogoutUseCase } from './users/application/usecases/logout.usecase';

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
        signOptions: { expiresIn: '20m' },
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
  DeleteSessionByIdUseCase,
  DeleteAllActiveSessionsUseCase,
  RefreshTokenUseCase,
  LogoutUseCase,
];
const queryHandler = [
  GetAllUsersQueryHandler,
  GetUserByIdHandler,
  GetAllActiveDevicesQueryHandler,
];
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
    SessionQueryRepository,
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
