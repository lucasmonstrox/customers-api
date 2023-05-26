import { PipeTransform, Injectable } from '@nestjs/common';
import { CustomerNotFoundException } from '../exceptions';
import { Customer } from '../models';
import { GetCustomerRepository } from '../repositories';

@Injectable()
export class CustomerByIdPipe
  implements PipeTransform<string, Promise<Customer>>
{
  constructor(private getCustomerRepository: GetCustomerRepository) {}

  async transform(customerId: string): Promise<Customer> {
    const customer = await this.getCustomerRepository.execute(customerId);
    const customerNotFound = !customer;
    if (customerNotFound) {
      throw new CustomerNotFoundException(customerId);
    }
    return customer;
  }
}
