import { makeCustomer } from '@/test/mocks/customers/models';

describe('Customer', () => {
  it('should get correctly cache key', async () => {
    const mockedCustomer = makeCustomer();
    const cacheKey = `customer:${mockedCustomer.id}`;
    expect(mockedCustomer.getCacheKey()).toBe(cacheKey);
  });

  it('should get correctly fields to be cached', async () => {
    const mockedCustomer = makeCustomer();
    expect(mockedCustomer.toCache()).toStrictEqual({
      name: mockedCustomer.name,
      document: mockedCustomer.document,
    });
  });
});
