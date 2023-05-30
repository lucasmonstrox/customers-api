import {
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Put,
  Version,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  BadRequestResponse,
  ErrorResponse,
} from '@/core/schemas/swagger/responses';
import {
  BAD_GATEWAY,
  BAD_REQUEST,
  CUSTOMER_CONFLICT,
  CUSTOMER_NOT_FOUND,
  GET_CUSTOMER,
  NOT_AUTHENTICATED,
} from '../consts/swagger';
import { UpdateCustomerService as IUpdateCustomerService } from '../domain';
import { CustomerDto } from '../dto';
import { Customer } from '../models';
import { UpdateCustomerService } from '../services';

@ApiTags('customers')
@Controller()
export class UpdateCustomerController {
  constructor(
    @Inject(UpdateCustomerService)
    private updateCustomerService: IUpdateCustomerService,
  ) {}

  @ApiBearerAuth()
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
  @ApiConflictResponse({
    type: ErrorResponse,
    description: CUSTOMER_CONFLICT,
  })
  @ApiBadGatewayResponse({
    type: ErrorResponse,
    description: BAD_GATEWAY,
  })
  @Version('1')
  @Put(':id')
  execute(
    @Param('id', new ParseUUIDPipe({ version: '4' })) customerId: string,
    @Body() customerDto: CustomerDto,
  ): ReturnType<IUpdateCustomerService['execute']> {
    return this.updateCustomerService.execute(customerId, customerDto);
  }
}
