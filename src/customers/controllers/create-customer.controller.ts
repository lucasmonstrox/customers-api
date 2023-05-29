import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
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
} from '@/core/schemas/swagger/responses';
import {
  BAD_GATEWAY,
  BAD_REQUEST,
  GET_CUSTOMER,
  NOT_AUTHENTICATED,
} from '../consts/swagger';
import { CreateCustomerService as ICreateCustomerService } from '../domain';
import { CreateCustomerDto } from '../dto';
import { Customer } from '../models';
import { CreateCustomerService } from '../services';

@ApiTags('customers')
@Controller()
export class CreateCustomerController {
  constructor(
    @Inject(CreateCustomerService)
    private createCustomerService: ICreateCustomerService,
  ) {}

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
    @Body() createCustomerDto: CreateCustomerDto,
  ): ReturnType<ICreateCustomerService['execute']> {
    return this.createCustomerService.execute(createCustomerDto);
  }
}
