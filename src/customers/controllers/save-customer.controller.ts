import { Body, Controller, Post, Version } from '@nestjs/common';
import { CustomerDto } from '../dto';
import { SaveCustomerService } from '../services';
import { SavedUserOutput } from '../types';

@Controller('customers')
export class SaveCustomerController {
  constructor(private saveCustomerService: SaveCustomerService) {}

  @Version('1')
  @Post()
  execute(@Body() customerDto: CustomerDto): SavedUserOutput {
    return this.saveCustomerService.execute(customerDto);
  }
}
