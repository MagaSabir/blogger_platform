import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoreConfig {
  constructor(private configService: ConfigService) {}

  getPort(): number {
    return Number(this.configService.get('PORT'));
  }
  getUri(): string {
    return this.configService.get('MONGO_URI') || '';
  }
}
