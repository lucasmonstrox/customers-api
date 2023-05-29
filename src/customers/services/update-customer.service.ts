import { Injectable } from '@nestjs/common';
import { CustomerDto } from '../dto';
import {
  CustomerIdAlreadyExists,
  CustomerNotFoundException,
} from '../exceptions';
import { Customer } from '../models';
import {
  GetCustomerRepository,
  HasCustomerByIdRepository,
  SaveCustomerRepository,
} from '../repositories';

@Injectable()
export class UpdateCustomerService {
  constructor(
    private getCustomerRepository: GetCustomerRepository,
    private hasCustomerByIdRepository: HasCustomerByIdRepository,
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
    const updatingCustomerIdIsDifferentFromCustomerId =
      customerId !== customerDto.id;
    if (updatingCustomerIdIsDifferentFromCustomerId) {
      const updatingCustomerIdAlreadyExists =
        await this.hasCustomerByIdRepository.execute(customerDto.id);
      if (updatingCustomerIdAlreadyExists) {
        throw new CustomerIdAlreadyExists(customerDto.id);
      }
    }
    const updatedCustomer = Object.assign<Customer, CustomerDto>(
      customer,
      customerDto,
    );
    await this.saveCustomerRepository.execute(updatedCustomer);
    return updatedCustomer;
  }
}
