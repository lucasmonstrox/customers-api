import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { CustomerDto } from '../dto';
import { SaveCustomerService } from '../services';
import { SavedUserOutput } from '../types';

@Controller()
export class SaveCustomerController {
  constructor(private saveCustomerService: SaveCustomerService) {}

  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  execute(@Body() customerDto: CustomerDto): SavedUserOutput {
    return this.saveCustomerService.execute(customerDto);
  }
}
