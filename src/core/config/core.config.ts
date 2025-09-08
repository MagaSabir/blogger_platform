import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ConfigValidation } from './config-validation';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing',
}
@Injectable()
export class CoreConfig {
  @IsNumber(
    {},
    {
      message: 'Set Env variable Port',
    },
  )
  port: number;

  @IsString({
    message: 'Set Env variable MONGO_URI',
  })
  mongo_uri: string;

  @IsEnum(Environments)
  env: string;

  constructor(private configService: ConfigService) {
    this.port = Number(this.configService.get('PORT'));
    this.mongo_uri = this.configService.get('MONGO_URI') || '';
    this.env = this.configService.get('NODE_ENV') || '';

    ConfigValidation.validationConfig(this);
  }
}
