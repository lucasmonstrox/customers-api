import { Module } from '@nestjs/common';
import {
  CreateCustomerController,
  GetCustomerController,
  UpdateCustomerController,
} from './controllers';
import { GetCustomerRepository, SaveCustomerRepository } from './repositories';
import {
  CreateCustomerService,
  GetCustomerService,
  UpdateCustomerService,
} from './services';

@Module({
  controllers: [
    CreateCustomerController,
    GetCustomerController,
    UpdateCustomerController,
  ],
  providers: [
    CreateCustomerService,
    GetCustomerRepository,
    GetCustomerService,
    SaveCustomerRepository,
    UpdateCustomerService,
  ],
})
export class CustomerModule {}
