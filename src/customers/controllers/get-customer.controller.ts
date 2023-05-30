import { Controller, Get, Inject, Param, Version } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'nest-keycloak-connect';
import { ErrorResponse } from '@/core/schemas/swagger/responses';
import {
  BAD_GATEWAY,
  CUSTOMER_NOT_FOUND,
  GET_CUSTOMER,
  NOT_AUTHENTICATED,
} from '../consts/swagger';
import { GetCustomerService as IGetCustomerService } from '../domain';
import { Customer } from '../models';
import { GetCustomerService } from '../services';

@ApiTags('customers')
@Controller()
export class GetCustomerController {
  constructor(
    @Inject(GetCustomerService)
    private getCustomerService: IGetCustomerService,
  ) {}

  @ApiBearerAuth()
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
  ): ReturnType<IGetCustomerService['execute']> {
    return this.getCustomerService.execute(customerId);
  }
}
