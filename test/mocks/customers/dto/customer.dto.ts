import { faker } from '@faker-js/faker';
import { CustomerDto } from '../../../../src/customers/dto';

export const makeCustomerDto = (data?: Partial<CustomerDto>): CustomerDto => ({
  name: faker.person.fullName(),
  document: faker.string.uuid(),
  ...data,
});
