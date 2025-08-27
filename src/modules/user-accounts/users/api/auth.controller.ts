import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../application/service/auth.service';
import { CreateUserInputDto } from './input-dto/create-user.dto';
import { LocalAuthGuard } from '../guards/local/local.auth.guard';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { AuthQueryRepository } from '../infrastructure/query-repository/auth.query-repository';
import { InputCodeValidation } from './input-dto/input-code-validation';
import { InputEmailValidation } from './input-dto/input-email-validation';
import { InputNewPasswordDto } from './input-dto/input-new-password.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../application/usecases/register-user.usecase';
import { LoginUserCommand } from '../application/usecases/login-user.usecase';
import { PasswordRecoveryCommand } from '../application/usecases/password-recovery.usecase';
import { NewPasswordCommand } from '../application/usecases/new-password.usecase';
import { ConfirmationCommand } from '../application/usecases/confirmation.usecase';
import { RegistrationResendingCommand } from '../application/usecases/registration-resending.usecase';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private authService: AuthService,
    private authQueryRepo: AuthQueryRepository,
  ) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: CreateUserInputDto) {
    await this.commandBus.execute(new RegisterUserCommand(dto));
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: { user: { id: string }; ip: string; headers: any },
    @Res() res: Response,
  ) {
    const ip = req.ip;
    const userAgent: string = req.headers['user-agent']
      ? req.headers['user-agent']
      : '';
    const {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string } =
      await this.commandBus.execute(
        new LoginUserCommand({ userId: req.user.id }, ip, userAgent),
      );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.json({ accessToken: accessToken });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: { user: { id: string } }) {
    return this.authQueryRepo.getUser(req.user.id);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmation(@Body() body: InputCodeValidation) {
    await this.commandBus.execute(new ConfirmationCommand(body.code));
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() body: InputEmailValidation) {
    await this.commandBus.execute(new RegistrationResendingCommand(body.email));
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() body: InputEmailValidation) {
    await this.commandBus.execute(new PasswordRecoveryCommand(body.email));
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: InputNewPasswordDto) {
    await this.commandBus.execute(
      new NewPasswordCommand(body.newPassword, body.recoveryCode),
    );
  }
}
