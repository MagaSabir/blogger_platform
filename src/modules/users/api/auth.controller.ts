import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { CreateUserInputDto } from './input-dto/create-user.dto';
import { LocalAuthGuard } from '../guards/local/local.auth.guard';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { AuthQueryRepository } from '../infrastructure/query-repository/auth.query-repository';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authQueryRepo: AuthQueryRepository,
  ) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: CreateUserInputDto) {
    await this.authService.registration(dto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(
    @Req() req: { user: { id: string } },
  ): Promise<{ accessToken: string }> {
    return this.authService.login(req.user.id);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    return this.authQueryRepo.getUser(req.user.id);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmation(@Body() body: { code: string }) {
    await this.authService.confirmation(body.code);
  }
}
