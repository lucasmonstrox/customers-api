import { Module } from '@nestjs/common';
import {
  GetCustomerController,
  SaveCustomerController,
  UpdateCustomerController,
} from './controllers';
import { GetCustomerRepository, SaveCustomerRepository } from './repositories';
import { SaveCustomerService, UpdateCustomerService } from './services';

@Module({
  controllers: [
    GetCustomerController,
    SaveCustomerController,
    UpdateCustomerController,
  ],
  providers: [
    GetCustomerRepository,
    SaveCustomerRepository,
    SaveCustomerService,
    UpdateCustomerService,
  ],
})
export class CustomerModule {}
