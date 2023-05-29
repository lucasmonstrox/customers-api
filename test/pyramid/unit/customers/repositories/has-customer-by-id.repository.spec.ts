import { Test } from '@nestjs/testing';
import { UnavailableCacheException } from '@/core/exceptions';
import { CacheRepository } from '@/core/repositories';
import { HasCustomerByIdRepository } from '@/customers/repositories';
import { makeCustomer } from '@/test/mocks/customers/models';
import { Customer } from '@/customers/models';

describe('HasCustomerByIdRepository', () => {
  let cacheRepository: CacheRepository;
  let hasCustomerByIdRepository: HasCustomerByIdRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CacheRepository, HasCustomerByIdRepository],
    })
      .overrideProvider(CacheRepository)
      .useValue({ keyExists: jest.fn() })
      .compile();
    cacheRepository = moduleRef.get<CacheRepository>(CacheRepository);
    hasCustomerByIdRepository = moduleRef.get<HasCustomerByIdRepository>(
      HasCustomerByIdRepository,
    );
  });

  it('should throw UnavailableCacheException', async () => {
    const { id } = makeCustomer();
    const cacheRepositorySpy = jest
      .spyOn(cacheRepository, 'keyExists')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    await expect(hasCustomerByIdRepository.execute(id)).rejects.toThrow(
      UnavailableCacheException,
    );
    expect(cacheRepositorySpy).toHaveBeenCalledWith(Customer.getCacheKey(id));
  });

  it('should return false when key does not exists', async () => {
    const { id } = makeCustomer();
    const cacheRepositorySpy = jest
      .spyOn(cacheRepository, 'keyExists')
      .mockResolvedValueOnce(false);
    const result = await hasCustomerByIdRepository.execute(id);
    expect(result).toBe(false);
    expect(cacheRepositorySpy).toHaveBeenCalledWith(Customer.getCacheKey(id));
  });

  it('should return true when key exists', async () => {
    const { id } = makeCustomer();
    const cacheRepositorySpy = jest
      .spyOn(cacheRepository, 'keyExists')
      .mockResolvedValueOnce(true);
    const result = await hasCustomerByIdRepository.execute(id);
    expect(result).toBe(true);
    expect(cacheRepositorySpy).toHaveBeenCalledWith(Customer.getCacheKey(id));
  });
});
