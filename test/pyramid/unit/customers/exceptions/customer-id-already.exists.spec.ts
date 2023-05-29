import { CustomerIdAlreadyExists } from '@/customers/exceptions';
import { makeCustomer } from '@/test/mocks/customers/models';

describe('CustomerIdAlreadyExists', () => {
  it('should return correct exception message', async () => {
    const mockedCustomer = makeCustomer();
    const result = CustomerIdAlreadyExists.makeMessage(mockedCustomer.id);
    expect(result).toStrictEqual(
      `Customer with id "${mockedCustomer.id}" already exists`,
    );
  });
});
