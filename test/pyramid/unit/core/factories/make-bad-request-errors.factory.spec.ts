import { makeBadRequestErrors } from '@/core/factories';
import { ValidationError } from '@nestjs/common';

describe('makeBadRequestErrors', () => {
  it('should make BadRequestErrors', () => {
    const validationErrors: ValidationError[] = [
      {
        property: 'name',
        constraints: { isNotEmpty: 'name is not empty' },
      },
      {
        property: 'document',
        constraints: { isNotEmpty: 'document is not empty' },
      },
    ];
    const result = makeBadRequestErrors(validationErrors);
    expect(result).toStrictEqual({
      errors: {
        name: { isNotEmpty: 'name is not empty' },
        document: { isNotEmpty: 'document is not empty' },
      },
    });
  });
});
