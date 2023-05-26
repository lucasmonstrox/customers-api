import { Controller, Get, Param, Version } from '@nestjs/common';
import { Customer } from '../models';
import { CustomerByIdPipe } from '../pipes';

@Controller()
export class GetCustomerController {
  @Version('1')
  @Get(':id')
  execute(@Param('id', CustomerByIdPipe) customer: Customer): Customer {
    return customer;
  }
}
