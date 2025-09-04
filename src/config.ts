import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';

export const configModule = ConfigModule.forRoot({
  envFilePath: [
    process.env.ENV_FILE_PATH?.trim() || '',
    `.env.${process.env.NODE_ENV}.local`,
    `.env.${process.env.NODE_ENV}`,
    '.env.testing',
    '.env.production',
  ],
  isGlobal: true,
});
