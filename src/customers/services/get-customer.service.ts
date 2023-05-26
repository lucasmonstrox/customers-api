import { Injectable } from '@nestjs/common';
import { Customer } from '../models';
import { GetCustomerRepository } from '../repositories';
import { CustomerNotFoundException } from '../exceptions/customer-not-found.exception';

@Injectable()
export class GetCustomerService {
  constructor(private getCustomerRepository: GetCustomerRepository) {}

  async execute(customerId: string): Promise<Customer> {
    const customer = await this.getCustomerRepository.execute(customerId);
    const customerNotFound = !customer;
    if (customerNotFound) {
      throw new CustomerNotFoundException(customerId);
    }
    return customer;
  }
}
