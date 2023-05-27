import { ValidationError } from 'class-validator';
import { BadRequestErrors } from '../types/api';

export const makeBadRequestErrors = (
  validationErrors: ValidationError[],
): BadRequestErrors => {
  const errors = {};
  validationErrors.forEach(({ constraints, property }) => {
    const keyNotNotExistsInErrors = !errors[property];
    if (keyNotNotExistsInErrors) {
      errors[property] = constraints;
    }
  });
  return errors;
};
