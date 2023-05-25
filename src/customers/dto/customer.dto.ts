import { IsNotEmpty, IsString } from 'class-validator';

export class CustomerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  document: string;
}
