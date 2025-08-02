import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formatted = errors.map((err) => ({
          messages: Object.values(err.constraints || {})[0],
          filed: err.property,
        }));

        throw new BadRequestException({ errorsMessages: formatted });
      },
    }),
  );
}
