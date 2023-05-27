import { ApiProperty } from '@nestjs/swagger';
import { RequiredFieldErrors } from '@/core/swagger/schema/responses';

export class CreateCustomerErrors {
  @ApiProperty({ required: false })
  name: RequiredFieldErrors;

  @ApiProperty({ required: false })
  document: RequiredFieldErrors;
}
