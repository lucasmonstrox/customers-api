import { Test } from '@nestjs/testing';
import { SaveCustomerRepository } from '@/customers/repositories';
import { CreateCustomerService } from '@/customers/services';
import { makeCustomerDto } from '@/test/mocks/customers/dto';

describe('CreateCustomerService', () => {
  let createCustomerService: CreateCustomerService;
  let saveCustomerRepository: SaveCustomerRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SaveCustomerRepository, CreateCustomerService],
    })
      .overrideProvider(SaveCustomerRepository)
      .useValue({ execute: jest.fn() })
      .compile();
    saveCustomerRepository = moduleRef.get<SaveCustomerRepository>(
      SaveCustomerRepository,
    );
    createCustomerService = moduleRef.get<CreateCustomerService>(
      CreateCustomerService,
    );
  });

  it('should save new Customer', async () => {
    const mockedCustomerDto = makeCustomerDto();
    const saveCustomerRepositorySpy = jest
      .spyOn(saveCustomerRepository, 'execute')
      .mockResolvedValueOnce(undefined);
    await createCustomerService.execute(mockedCustomerDto);
    expect(saveCustomerRepositorySpy).toHaveBeenCalled();
  });
});
