import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { UnavailableCacheException } from '@/cache/exceptions';
import { CacheRepository } from '@/cache/repositories';
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
    jest.spyOn(cacheRepository, 'get').mockResolvedValueOnce(null);
    const customerId = faker.string.uuid();
    const result = await getCustomerRepository.execute(customerId);
    expect(result).toBeNull();
  });

  it('should throw UnavailableCacheException when cache is not available', async () => {
    jest.spyOn(cacheRepository, 'get').mockImplementationOnce(() => {
      throw new Error();
    });
    const customerId = faker.string.uuid();
    await expect(getCustomerRepository.execute(customerId)).rejects.toThrow(
      UnavailableCacheException,
    );
  });

  it('should return Customer when Customer is found in cache', async () => {
    const mockedCustomer = makeCustomer();
    jest.spyOn(cacheRepository, 'get').mockResolvedValueOnce({
      id: mockedCustomer.id,
      ...mockedCustomer.toCache(),
    });
    const result = await getCustomerRepository.execute(mockedCustomer.id);
    expect(result).toStrictEqual(mockedCustomer);
  });
});
