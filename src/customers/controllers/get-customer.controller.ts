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
import {
  BAD_GATEWAY,
  CUSTOMER_NOT_FOUND,
  GET_CUSTOMER,
  NOT_AUTHENTICATED,
} from '../consts/swagger';
import { Customer } from '../models';
import { GetCustomerService } from '../services';

@ApiTags('customers')
@Controller()
export class GetCustomerController {
  constructor(private getCustomerService: GetCustomerService) {}

  @ApiOperation({ summary: 'Get Customer data' })
  @ApiOkResponse({
    type: Customer,
    description: GET_CUSTOMER,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: NOT_AUTHENTICATED,
  })
  @ApiNotFoundResponse({
    type: ErrorResponse,
    description: CUSTOMER_NOT_FOUND,
  })
  @ApiBadGatewayResponse({
    type: ErrorResponse,
    description: BAD_GATEWAY,
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
