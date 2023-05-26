import { Module } from '@nestjs/common';
import { GetCustomerController, SaveCustomerController } from './controllers';
import { GetCustomerRepository, SaveCustomerRepository } from './repositories';
import { GetCustomerService, SaveCustomerService } from './services';

@Module({
  controllers: [GetCustomerController, SaveCustomerController],
  providers: [
    GetCustomerRepository,
    GetCustomerService,
    SaveCustomerRepository,
    SaveCustomerService,
  ],
})
export class CustomerModule {}
