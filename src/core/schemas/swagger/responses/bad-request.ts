import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponse {
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      oneOf: [{ type: 'string' }],
    },
  })
  errors: Record<string, Record<string, string>>;
}
