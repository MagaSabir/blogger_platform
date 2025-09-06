import { Injectable } from '@nestjs/common';
import { IsBoolean } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ConfigValidation } from '../../../core/config/config-validation';

@Injectable()
export class UsersConfig {
  @IsBoolean({
    message: 'Set Env variable USER_IS_AUTO_CONFIRMED',
  })
  isAutoConfirmed: boolean;

  constructor(private configService: ConfigService) {
    this.isAutoConfirmed =
      this.configService.get('USER_IS_AUTO_CONFIRMED') === 'true';

    ConfigValidation.validationConfig(this);
  }
}
