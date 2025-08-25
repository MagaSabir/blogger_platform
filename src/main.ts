import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  appSetup(app);
  app.set('trust proxy', true);

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
