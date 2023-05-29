import { Customer } from './models';

export interface DeleteCustomerRepository {
  execute(customerId: string): Promise<void>;
}

export interface GetCustomerRepository {
  execute(customerId: string): Promise<Customer | null>;
}

export interface HasCustomerByIdRepository {
  execute(customerId: string): Promise<boolean>;
}

export interface SaveCustomerRepository {
  execute(customer: Customer): Promise<void>;
}
