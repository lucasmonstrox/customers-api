import { faker } from '@faker-js/faker';
import { CustomerDto } from '@/customers/dto';
import { makeCreateCustomerDto } from './create-customer.dto';

export const makeCustomerDto = (data?: Partial<CustomerDto>): CustomerDto => ({
  id: faker.string.uuid(),
  ...makeCreateCustomerDto(),
  ...data,
});
