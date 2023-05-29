import { Inject, Injectable } from '@nestjs/common';
import { SaveCustomerRepository as ISaveCustomerRepository } from '../domain';
import { CreateCustomerDto } from '../dto';
import { Customer } from '../models';
import { SaveCustomerRepository } from '../repositories';

@Injectable()
export class CreateCustomerService {
  constructor(
    @Inject(SaveCustomerRepository)
    private saveCustomerRepository: ISaveCustomerRepository,
  ) {}

  async execute({ name, document }: CreateCustomerDto): Promise<Customer> {
    const customer = new Customer(name, document);
    await this.saveCustomerRepository.execute(customer);
    return customer;
  }
}
