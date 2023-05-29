import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { CacheRepository } from '@/core/repositories';
import { Customer } from '@/customers/models';
import { GetCustomerRepository } from '@/customers/repositories';
import { makeCustomer } from '@/test/mocks/customers/models';

describe('GetCustomerRepository', () => {
  let cacheRepository: CacheRepository;
  let getCustomerRepository: GetCustomerRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CacheRepository, GetCustomerRepository],
    })
      .overrideProvider(CacheRepository)
      .useValue({ get: jest.fn() })
      .compile();
    cacheRepository = moduleRef.get<CacheRepository>(CacheRepository);
    getCustomerRepository = moduleRef.get<GetCustomerRepository>(
      GetCustomerRepository,
    );
  });

  it('should return null when Customer is not found in cache', async () => {
    const cacheRepositorySpy = jest
      .spyOn(cacheRepository, 'get')
      .mockResolvedValueOnce(null);
    const customerId = faker.string.uuid();
    const result = await getCustomerRepository.execute(customerId);
    expect(result).toBeNull();
    expect(cacheRepositorySpy).toHaveBeenCalledWith(
      Customer.getCacheKey(customerId),
    );
  });

  it('should return Customer when Customer is found in cache', async () => {
    const mockedCustomer = makeCustomer();
    const cacheRepositorySpy = jest
      .spyOn(cacheRepository, 'get')
      .mockResolvedValueOnce({
        id: mockedCustomer.id,
        ...mockedCustomer.toCache(),
      });
    const result = await getCustomerRepository.execute(mockedCustomer.id);
    expect(result).toStrictEqual(mockedCustomer);
    expect(cacheRepositorySpy).toHaveBeenCalledWith(
      Customer.getCacheKey(mockedCustomer.id),
    );
  });
});
