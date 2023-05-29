import { faker } from '@faker-js/faker';
import { CreateCustomerDto } from '@/customers/dto';

export const makeCreateCustomerDto = (
  data?: Partial<CreateCustomerDto>,
): CreateCustomerDto => ({
  name: faker.person.fullName(),
  document: faker.string.uuid(),
  ...data,
});
