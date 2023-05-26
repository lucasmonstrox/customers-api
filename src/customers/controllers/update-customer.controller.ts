import { Body, Controller, Param, Put, Version } from '@nestjs/common';
import { CustomerDto } from '../dto';
import { Customer } from '../models';
import { CustomerByIdPipe } from '../pipes';
import { UpdateCustomerService } from '../services';
import { SavedUserOutput } from '../types';

@Controller()
export class UpdateCustomerController {
  constructor(private updateCustomerService: UpdateCustomerService) {}

  @Version('1')
  @Put(':id')
  execute(
    @Param('id', CustomerByIdPipe) customer: Customer,
    @Body() customerDto: CustomerDto,
  ): SavedUserOutput {
    return this.updateCustomerService.execute(customer, customerDto);
  }
}
