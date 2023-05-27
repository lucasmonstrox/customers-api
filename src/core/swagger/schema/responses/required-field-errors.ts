import { ApiProperty } from '@nestjs/swagger';

export class RequiredFieldErrors {
  @ApiProperty({ required: false })
  isNotEmpty: string;

  @ApiProperty({ required: false })
  isString: string;
}
