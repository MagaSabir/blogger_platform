import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query-repository/users.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/users.domain';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './guards/basic/basic.strategy';
import { AuthService } from './application/auth.service';
import { AuthController } from './api/auth.controller';
import { BcryptService } from './application/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './guards/local/local.strategy';
import { AuthQueryRepository } from './infrastructure/query-repository/auth.query-repository';
import { JwtStrategy } from './guards/bearer/jwt-strategy';
import { EmailService } from '../notification/email.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'access-token-secret',
      signOptions: { expiresIn: '60m' },
    }),
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
  ],
})
export class UsersModule {}
