import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formatted = errors.map((err) => ({
          message: Object.values(err.constraints || {})[0],
          field: err.property,
        }));
        return new BadRequestException({
          errorsMessages: formatted,
        });
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Blogger Platform')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('Blog')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
