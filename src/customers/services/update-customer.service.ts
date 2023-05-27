import { Injectable } from '@nestjs/common';
import { CustomerDto } from '../dto';
import { Customer } from '../models';
import { GetCustomerRepository, SaveCustomerRepository } from '../repositories';
import { CustomerNotFoundException } from '../exceptions';

@Injectable()
export class UpdateCustomerService {
  constructor(
    private getCustomerRepository: GetCustomerRepository,
    private saveCustomerRepository: SaveCustomerRepository,
  ) {}

  async execute(
    customerId: string,
    customerDto: CustomerDto,
  ): Promise<Customer> {
    const customer = await this.getCustomerRepository.execute(customerId);
    const customerNotFound = !customer;
    if (customerNotFound) {
      throw new CustomerNotFoundException(customerId);
    }
    const updatedCustomer = Object.assign<Customer, CustomerDto>(
      customer,
      customerDto,
    );
    await this.saveCustomerRepository.execute(updatedCustomer);
    return updatedCustomer;
  }
}
