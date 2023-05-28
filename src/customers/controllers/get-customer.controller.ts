import { Controller, Get, Param, Version } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'nest-keycloak-connect';
import { ErrorResponse } from '@/core/swagger/schemas/responses';
import { Customer } from '../models';
import { GetCustomerService } from '../services';

@ApiTags('customers')
@Controller()
export class GetCustomerController {
  constructor(private getCustomerService: GetCustomerService) {}

  @ApiOperation({ summary: 'Get Customer data' })
  @ApiOkResponse({
    type: Customer,
    description: 'Returns the Customer with his data',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: 'Occurs when the User is not authenticated',
  })
  @ApiNotFoundResponse({
    type: ErrorResponse,
    description: 'Occurs when a Customer is not found',
  })
  @ApiBadGatewayResponse({
    type: ErrorResponse,
    description: 'Occurs when Cache/SSO is unavailable',
  })
  @Version('1')
  @Roles({ roles: ['user'] })
  @Get(':id')
  async execute(
    @Param('id') customerId: string,
  ): ReturnType<GetCustomerService['execute']> {
    return this.getCustomerService.execute(customerId);
  }
}
