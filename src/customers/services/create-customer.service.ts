import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto';
import { Customer } from '../models';
import { SaveCustomerRepository } from '../repositories';

@Injectable()
export class CreateCustomerService {
  constructor(private saveCustomerRepository: SaveCustomerRepository) {}

  async execute({ name, document }: CreateCustomerDto): Promise<Customer> {
    const customer = new Customer(name, document);
    await this.saveCustomerRepository.execute(customer);
    return customer;
  }
}
