import { Injectable } from '@nestjs/common';
import { IsBoolean, IsString, Length } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigValidation } from '../../../core/config/config-validation';

@Injectable()
export class UsersConfig {
  @IsBoolean({
    message: 'Set Env variable USER_IS_AUTO_CONFIRMED',
  })
  isAutoConfirmed: boolean;

  password: string;

  login: string;

  constructor(private configService: ConfigService) {
    this.isAutoConfirmed =
      this.configService.get('USER_IS_AUTO_CONFIRMED') === 'true';
    this.password = this.configService.get('PASSWORD') || '';
    this.login = this.configService.get('LOGIN') || '';
    ConfigValidation.validationConfig(this);
    console.log(this.configService);
  }
}
