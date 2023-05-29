import { Inject, Injectable } from '@nestjs/common';
import {
  CreateCustomerDto,
  CreateCustomerService as ICreateCustomerService,
  SaveCustomerRepository as ISaveCustomerRepository,
} from '../domain';
import { Customer } from '../models';
import { SaveCustomerRepository } from '../repositories';

@Injectable()
export class CreateCustomerService implements ICreateCustomerService {
  constructor(
    @Inject(SaveCustomerRepository)
    private saveCustomerRepository: ISaveCustomerRepository,
  ) {}

  async execute({
    name,
    document,
  }: CreateCustomerDto): ReturnType<ICreateCustomerService['execute']> {
    const customer = new Customer(name, document);
    await this.saveCustomerRepository.execute(customer);
    return customer;
  }
}
