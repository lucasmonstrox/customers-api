import { Test } from '@nestjs/testing';
import { CacheRepository } from '@/core/repositories';
import { Customer } from '@/customers/models';
import { DeleteCustomerRepository } from '@/customers/repositories';
import { makeCustomer } from '@/test/mocks/customers/models';

describe('DeleteCustomerRepository', () => {
  let cacheRepository: CacheRepository;
  let deleteCustomerRepository: DeleteCustomerRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CacheRepository, DeleteCustomerRepository],
    })
      .overrideProvider(CacheRepository)
      .useValue({ delete: jest.fn() })
      .compile();
    cacheRepository = moduleRef.get<CacheRepository>(CacheRepository);
    deleteCustomerRepository = moduleRef.get<DeleteCustomerRepository>(
      DeleteCustomerRepository,
    );
  });

  it('should call cacheRepository.delete', async () => {
    const mockedCustomer = makeCustomer();
    const cacheRepositorySpy = jest.spyOn(cacheRepository, 'delete');
    await deleteCustomerRepository.execute(mockedCustomer.id);
    expect(cacheRepositorySpy).toHaveBeenCalledWith(
      Customer.getCacheKey(mockedCustomer.id),
    );
  });
});
