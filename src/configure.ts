import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';
import { AppModule } from './app.module';

const makeErrors = (validationErrors: ValidationError[]) => {
  const errors = {};
  validationErrors.forEach(({ children, constraints, property }) => {
    const keyNotNotExistsInErrors = !errors[property];
    if (keyNotNotExistsInErrors) {
      errors[property] = { errors: constraints };
      const hasChildrens = children?.length > 0;
      if (hasChildrens) {
        errors[property].children = makeErrors(children);
      }
    }
  });
  return errors;
};

export const configure = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors) => {
        const errors = makeErrors(validationErrors);
        return new BadRequestException(errors);
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
