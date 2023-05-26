import { Controller, Get, Param, ParseUUIDPipe, Version } from '@nestjs/common';
import { GetCustomerService } from '../services';

@Controller()
export class GetCustomerController {
  constructor(private getCustomerService: GetCustomerService) {}

  @Version('1')
  @Get(':id')
  execute(
    @Param('id', new ParseUUIDPipe()) customerId: string,
  ): ReturnType<GetCustomerService['execute']> {
    return this.getCustomerService.execute(customerId);
  }
}
