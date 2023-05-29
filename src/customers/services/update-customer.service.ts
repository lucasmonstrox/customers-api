import { Inject, Injectable } from '@nestjs/common';
import {
  DeleteCustomerRepository as IDeleteCustomerRepository,
  GetCustomerRepository as IGetCustomerRepository,
  HasCustomerByIdRepository as IHasCustomerByIdRepository,
  SaveCustomerRepository as ISaveCustomerRepository,
} from '../domain';
import { CustomerDto } from '../dto';
import {
  CustomerIdAlreadyExists,
  CustomerNotFoundException,
} from '../exceptions';
import { Customer } from '../models';
import {
  DeleteCustomerRepository,
  GetCustomerRepository,
  HasCustomerByIdRepository,
  SaveCustomerRepository,
} from '../repositories';

@Injectable()
export class UpdateCustomerService {
  constructor(
    @Inject(DeleteCustomerRepository)
    private deleteCustomerRepository: IDeleteCustomerRepository,
    @Inject(GetCustomerRepository)
    private getCustomerRepository: IGetCustomerRepository,
    @Inject(HasCustomerByIdRepository)
    private hasCustomerByIdRepository: IHasCustomerByIdRepository,
    @Inject(SaveCustomerRepository)
    private saveCustomerRepository: ISaveCustomerRepository,
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
    ) as Customer;
    await this.saveCustomerRepository.execute(updatedCustomer);
    if (updatingCustomerIdIsDifferentFromCustomerId) {
      await this.deleteCustomerRepository.execute(customerId);
    }
    return updatedCustomer;
  }
}
