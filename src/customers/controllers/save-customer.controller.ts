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
import { CustomerDto } from '../dto';
import { Customer } from '../models';
import { SaveCustomerService } from '../services';

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
    description: 'Occurs when body is invalid or has validation errors',
  })
  @ApiUnauthorizedResponse({
    description: 'Occurs when the User is not authenticated',
  })
  @ApiBadGatewayResponse({
    description: 'Occurs when a Cache/SSO is unavailable',
  })
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async execute(
    @Body() customerDto: CustomerDto,
  ): ReturnType<SaveCustomerService['execute']> {
    return this.saveCustomerService.execute(customerDto);
  }
}
