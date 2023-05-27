import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty()
  errorCode: string;

  @ApiProperty()
  errorMessage: string;
}

export class ErrorResponse2 {
  @ApiProperty()
  errorCode: string;

  @ApiProperty()
  errorMessage: string;
}
