import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
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
import { SaveCustomerService } from '../services';
import { CreateCustomerErrors } from '../swagger/schemas';

@ApiTags('customer')
@Controller()
export class SaveCustomerController {
  constructor(private saveCustomerService: SaveCustomerService) {}

  @ApiOperation({ summary: 'Create new Customer' })
  @ApiCreatedResponse({
    type: Customer,
    description: 'Returns the Customer with his data',
  })
  @ApiBadRequestResponse({
    type: CreateCustomerErrors,
    description: 'Occurs when body is invalid or has validation errors',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: 'Occurs when the User is not authenticated',
  })
  @ApiBadGatewayResponse({
    type: ErrorResponse,
    description: 'Occurs when Cache/SSO is unavailable',
  })
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @Roles({ roles: ['user'] })
  @Post()
  async execute(
    @Body() customerDto: CustomerDto,
  ): ReturnType<SaveCustomerService['execute']> {
    return this.saveCustomerService.execute(customerDto);
  }
}
