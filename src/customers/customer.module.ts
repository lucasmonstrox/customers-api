import { Module } from '@nestjs/common';
import {
  CreateCustomerController,
  GetCustomerController,
  UpdateCustomerController,
} from './controllers';
import {
  DeleteCustomerRepository,
  GetCustomerRepository,
  HasCustomerByIdRepository,
  SaveCustomerRepository,
} from './repositories';
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
    DeleteCustomerRepository,
    HasCustomerByIdRepository,
    GetCustomerRepository,
    GetCustomerService,
    SaveCustomerRepository,
    UpdateCustomerService,
  ],
})
export class CustomerModule {}
