import { Module } from '@nestjs/common';
import {
  GetCustomerController,
  SaveCustomerController,
  UpdateCustomerController,
} from './controllers';
import { GetCustomerRepository, SaveCustomerRepository } from './repositories';
import {
  GetCustomerService,
  SaveCustomerService,
  UpdateCustomerService,
} from './services';

@Module({
  controllers: [
    GetCustomerController,
    SaveCustomerController,
    UpdateCustomerController,
  ],
  providers: [
    GetCustomerRepository,
    GetCustomerService,
    SaveCustomerRepository,
    SaveCustomerService,
    UpdateCustomerService,
  ],
})
export class CustomerModule {}
