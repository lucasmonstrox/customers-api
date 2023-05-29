import { PickType } from '@nestjs/swagger';
import { CustomerDto } from './customer.dto';

export class CreateCustomerDto extends PickType(CustomerDto, [
  'name',
  'document',
] as const) {}
