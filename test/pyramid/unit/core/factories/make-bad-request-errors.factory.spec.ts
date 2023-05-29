import { makeBadRequestErrors } from '@/core/factories';
import { ValidationError } from '@nestjs/common';

describe('makeBadRequestErrors', () => {
  it('should make BadRequestErrors', () => {
    const validationErrors: ValidationError[] = [
      {
        property: 'name',
        constraints: { isNotEmpty: 'name should not be empty' },
      },
      {
        property: 'document',
        constraints: { isNotEmpty: 'document should not be empty' },
      },
    ];
    const result = makeBadRequestErrors(validationErrors);
    expect(result).toStrictEqual({
      errors: {
        name: { isNotEmpty: 'name should not be empty' },
        document: { isNotEmpty: 'document should not be empty' },
      },
    });
  });
});
