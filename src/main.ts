import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CoreConfig } from './core/config/core.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  appSetup(app);
  app.set('trust proxy', true);
  const coreConfig = app.get<CoreConfig>(CoreConfig);
  app.use(cookieParser());

  await app.listen(coreConfig.getPort() ?? 3000);
}

bootstrap();
