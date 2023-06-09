import { Test } from '@nestjs/testing';
import { CacheRepository } from '@/core/repositories';
import { Customer } from '@/customers/models';
import { SaveCustomerRepository } from '@/customers/repositories';
import { makeCustomer } from '@/test/mocks/customers/models';

describe('SaveCustomerRepository', () => {
  let cacheRepository: CacheRepository;
  let saveCustomerRepository: SaveCustomerRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CacheRepository, SaveCustomerRepository],
    })
      .overrideProvider(CacheRepository)
      .useValue({ set: jest.fn() })
      .compile();
    cacheRepository = moduleRef.get<CacheRepository>(CacheRepository);
    saveCustomerRepository = moduleRef.get<SaveCustomerRepository>(
      SaveCustomerRepository,
    );
  });

  it('should save Customer', async () => {
    const mockedCustomer = makeCustomer();
    const cacheRepositorySpy = jest.spyOn(cacheRepository, 'set');
    await saveCustomerRepository.execute(mockedCustomer);
    expect(cacheRepositorySpy).toHaveBeenCalledWith(
      Customer.getCacheKey(mockedCustomer.id),
      mockedCustomer.toCache(),
    );
  });
});
