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
import { Response, Request } from 'express';
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
import { RefreshTokenGuard } from '../guards/refresh-token/refresh-token-guard';
import { GetRefreshToken } from '../../decorators/get-refresh-token';
import { RefreshTokenCommand } from '../application/usecases/refresh-token.usecase';
import { LogoutCommand } from '../application/usecases/logout.usecase';
import { CurrentUserId } from '../../../../core/decorators/current-user-id';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private authQueryRepo: AuthQueryRepository,
  ) {}

  @Post('registration')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: CreateUserInputDto) {
    await this.commandBus.execute(new RegisterUserCommand(dto));
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUserId() userId: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const ip = req.ip || 'undefined';
    const userAgent: string = req.headers['user-agent'] || 'undefined';
    const {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string } =
      await this.commandBus.execute(
        new LoginUserCommand({ userId }, ip, userAgent),
      );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.json({ accessToken: accessToken });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUserId() userId: string) {
    return this.authQueryRepo.getUser(userId);
  }

  @Post('registration-confirmation')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmation(@Body() body: InputCodeValidation) {
    await this.commandBus.execute(new ConfirmationCommand(body.code));
  }

  @Post('registration-email-resending')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() body: InputEmailValidation) {
    await this.commandBus.execute(new RegistrationResendingCommand(body.email));
  }

  @Post('password-recovery')
  @Throttle({ default: { limit: 5, ttl: 10000 } })
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

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@GetRefreshToken() token: string, @Res() res: Response) {
    const result: {
      accessToken: string;
      refreshToken: string;
    } = await this.commandBus.execute(new RefreshTokenCommand(token));

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.json({ accessToken: result.accessToken });
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  async logout(@GetRefreshToken() token: string, @Res() res: Response) {
    await this.commandBus.execute(new LogoutCommand(token));
    res.clearCookie('refreshToken');
    return res.sendStatus(204);
  }
}
