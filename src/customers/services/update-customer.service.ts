import { Injectable } from '@nestjs/common';
import { CustomerDto } from '../dto';
import { Customer } from '../models';
import { SaveCustomerRepository } from '../repositories';
import { SavedUserOutput } from '../types';

@Injectable()
export class UpdateCustomerService {
  constructor(private saveCustomerRepository: SaveCustomerRepository) {}

  async execute(customer: Customer, customerDto: CustomerDto): SavedUserOutput {
    const updatedCustomer = Object.assign<Customer, CustomerDto>(
      customer,
      customerDto,
    );
    await this.saveCustomerRepository.execute(updatedCustomer);
    return updatedCustomer;
  }
}
