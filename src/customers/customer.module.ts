import { Module } from '@nestjs/common';
import { SaveCustomerController } from './controllers';
import { SaveCustomerRepository } from './repositories';
import { SaveCustomerService } from './services';

@Module({
  controllers: [SaveCustomerController],
  providers: [SaveCustomerRepository, SaveCustomerService],
})
export class CustomerModule {}
