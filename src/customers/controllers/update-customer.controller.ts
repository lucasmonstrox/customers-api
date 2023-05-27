import { Body, Controller, Param, Put, Version } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CustomerDto } from '../dto';
import { Customer } from '../models';
import { UpdateCustomerService } from '../services';

@ApiTags('customer')
@Controller()
export class UpdateCustomerController {
  constructor(private updateCustomerService: UpdateCustomerService) {}

  @ApiOperation({ summary: 'Update Customer data' })
  @ApiCreatedResponse({
    type: Customer,
    description: 'Returns the Customer with his data',
  })
  @ApiUnauthorizedResponse({
    description: 'Occurs when the User is not authenticated',
  })
  @ApiBadRequestResponse({
    description: 'Occurs when body is invalid or has validation errors',
  })
  @ApiBadGatewayResponse({
    description: 'Occurs when a Cache/SSO is unavailable',
  })
  @Version('1')
  @Put(':id')
  execute(
    @Param('id') customerId: string,
    @Body() customerDto: CustomerDto,
  ): ReturnType<UpdateCustomerService['execute']> {
    return this.updateCustomerService.execute(customerId, customerDto);
  }
}
