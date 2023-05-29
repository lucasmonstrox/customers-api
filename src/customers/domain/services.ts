import { Customer } from './models';

export type CustomerDto = Pick<Customer, 'id' | 'name' | 'document'>;
export type CreateCustomerDto = Pick<CustomerDto, 'name' | 'document'>;

export interface CreateCustomerService {
  execute(dto: CreateCustomerDto): Promise<Customer>;
}

export interface GetCustomerService {
  execute(customerId: string): Promise<Customer>;
}

export interface UpdateCustomerService {
  execute(customerId: string, customerDto: CustomerDto): Promise<Customer>;
}
