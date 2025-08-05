import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  login(@Req() req: { user: { id: string } }): { accessToken: string } {
    return this.authService.login(req.user.id);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: { user: { id: string } }) {
    return this.authQueryRepo.getUser(req.user.id);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmation(@Body() body: InputCodeValidation) {
    await this.authService.confirmation(body.code);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() body: InputEmailValidation) {
    await this.authService.registrationResending(body.email);
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() body: InputEmailValidation) {
    await this.authService.passwordRecovery(body.email);
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: InputNewPasswordDto) {
    await this.authService.newPassword(body.newPassword, body.recoveryCode);
  }
}
