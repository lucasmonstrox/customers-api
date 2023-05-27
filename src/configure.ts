import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { makeBadRequestErrors } from './core/factories';

export const configure = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors) => {
        const errors = makeBadRequestErrors(validationErrors);
        return new BadRequestException(errors);
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
