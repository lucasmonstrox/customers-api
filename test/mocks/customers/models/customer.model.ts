import { faker } from '@faker-js/faker';
import { Customer } from '../../../../src/customers/models';

export const makeCustomer = (data?: Partial<Customer>): Customer => {
  const customerData = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    document: faker.string.uuid(),
    ...data,
  };
  return new Customer(
    customerData.name,
    customerData.document,
    customerData.id,
  );
};
