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
import {
  BadRequestResponse,
  ErrorResponse,
} from '@/core/swagger/schemas/responses';
import {
  BAD_GATEWAY,
  BAD_REQUEST,
  GET_CUSTOMER,
  NOT_AUTHENTICATED,
} from '../consts/swagger';
import { CustomerDto } from '../dto';
import { Customer } from '../models';
import { SaveCustomerService } from '../services';

@ApiTags('customers')
@Controller()
export class SaveCustomerController {
  constructor(private saveCustomerService: SaveCustomerService) {}

  @ApiOperation({ summary: 'Create new Customer' })
  @ApiCreatedResponse({
    type: Customer,
    description: GET_CUSTOMER,
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: BAD_REQUEST,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: NOT_AUTHENTICATED,
  })
  @ApiBadGatewayResponse({
    type: ErrorResponse,
    description: BAD_GATEWAY,
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
