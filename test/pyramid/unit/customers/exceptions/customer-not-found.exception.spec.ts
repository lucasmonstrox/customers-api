import { CustomerNotFoundException } from '../../../../../src/customers/exceptions';
import { makeCustomer } from '../../../../mocks/customers/models';

describe('CustomerNotFoundException', () => {
  it('should return correct exception message', async () => {
    const mockedCustomer = makeCustomer();
    const result = CustomerNotFoundException.makeMessage(mockedCustomer.id);
    expect(result).toStrictEqual(
      `Customer with id "${mockedCustomer.id}" not found`,
    );
  });
});
