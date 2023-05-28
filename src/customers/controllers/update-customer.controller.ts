import { Body, Controller, Param, Put, Version } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'nest-keycloak-connect';
import {
  BadRequestResponse,
  ErrorResponse,
} from '@/core/swagger/schemas/responses';
import {
  BAD_GATEWAY,
  BAD_REQUEST,
  CUSTOMER_NOT_FOUND,
  GET_CUSTOMER,
  NOT_AUTHENTICATED,
} from '../consts/swagger';
import { CustomerDto } from '../dto';
import { Customer } from '../models';
import { UpdateCustomerService } from '../services';

@ApiTags('customers')
@Controller()
export class UpdateCustomerController {
  constructor(private updateCustomerService: UpdateCustomerService) {}

  @ApiOperation({ summary: 'Update Customer data' })
  @ApiCreatedResponse({
    type: Customer,
    description: GET_CUSTOMER,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: NOT_AUTHENTICATED,
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: BAD_REQUEST,
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
  @Put(':id')
  execute(
    @Param('id') customerId: string,
    @Body() customerDto: CustomerDto,
  ): ReturnType<UpdateCustomerService['execute']> {
    return this.updateCustomerService.execute(customerId, customerDto);
  }
}
