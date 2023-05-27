import { Injectable } from '@nestjs/common';
import { CustomerNotFoundException } from '../exceptions';
import { Customer } from '../models';
import { GetCustomerRepository } from '../repositories';

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
