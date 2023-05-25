import { Injectable } from '@nestjs/common';
import { Customer } from '../models/customer';
import { SaveCustomerRepository } from '../repositories';
import { Input, SavedUserOutput } from '../types';

@Injectable()
export class SaveCustomerService {
  constructor(private saveCustomerRepository: SaveCustomerRepository) {}

  async execute({ name, document }: Input): SavedUserOutput {
    const customer = new Customer(name, document);
    await this.saveCustomerRepository.execute(customer);
    return customer;
  }
}
