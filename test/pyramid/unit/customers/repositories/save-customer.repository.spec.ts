import { Test } from '@nestjs/testing';
import { CacheRepository } from '../../../../../src/cache/repositories';
import { SaveCustomerRepository } from '../../../../../src/customers/repositories';
import { makeCustomer } from '../../../../mocks/customers/models/customer.model';

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

  fit('should save Customer', async () => {
    const mockedCustomer = makeCustomer();
    const cacheRepositorySpy = jest
      .spyOn(cacheRepository, 'set')
      .mockResolvedValueOnce(undefined);
    await saveCustomerRepository.execute(mockedCustomer);
    expect(cacheRepositorySpy).toHaveBeenCalledWith(
      mockedCustomer.getCacheKey(),
      mockedCustomer.toCache(),
    );
  });
});
