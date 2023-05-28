import { Body, Controller, Param, Put, Version } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'nest-keycloak-connect';
import { ErrorResponse } from '@/core/swagger/schema/responses';
import { CustomerDto } from '../dto';
import { Customer } from '../models';
import { UpdateCustomerService } from '../services';
import { CustomerErrors } from '../swagger/schemas';

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
    type: ErrorResponse,
    description: 'Occurs when the User is not authenticated',
  })
  @ApiBadRequestResponse({
    type: CustomerErrors,
    description: 'Occurs when body is invalid or has validation errors',
  })
  @ApiBadGatewayResponse({
    type: ErrorResponse,
    description: 'Occurs when Cache/SSO is unavailable',
  })
  @Version('1')
  @Roles({ roles: ['user'] })
  @Put(':id')
  execute(
    @Param('id') customerId: string,
    @Body() customerDto: CustomerDto,
  ): ReturnType<UpdateCustomerService['execute']> {
    return this.updateCustomerService.execute(customerId, customerDto);
  }
}
