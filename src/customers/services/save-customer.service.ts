import { Injectable } from '@nestjs/common';
import { CustomerDto } from '../dto';
import { Customer } from '../models';
import { SaveCustomerRepository } from '../repositories';

@Injectable()
export class SaveCustomerService {
  constructor(private saveCustomerRepository: SaveCustomerRepository) {}

  async execute({ name, document }: CustomerDto): Promise<Customer> {
    const customer = new Customer(name, document);
    await this.saveCustomerRepository.execute(customer);
    return customer;
  }
}
