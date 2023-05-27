import { Test } from '@nestjs/testing';
import { SaveCustomerRepository } from '../../../../../src/customers/repositories';
import { SaveCustomerService } from '../../../../../src/customers/services';
import { makeCustomerDto } from '../../../../mocks/customers/dto';

describe('SaveCustomerService', () => {
  let saveCustomerRepository: SaveCustomerRepository;
  let saveCustomerService: SaveCustomerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SaveCustomerRepository, SaveCustomerService],
    })
      .overrideProvider(SaveCustomerRepository)
      .useValue({ execute: jest.fn() })
      .compile();
    saveCustomerRepository = moduleRef.get<SaveCustomerRepository>(
      SaveCustomerRepository,
    );
    saveCustomerService =
      moduleRef.get<SaveCustomerService>(SaveCustomerService);
  });

  it('should save new Customer', async () => {
    const mockedCustomerDto = makeCustomerDto();
    const saveCustomerRepositorySpy = jest
      .spyOn(saveCustomerRepository, 'execute')
      .mockResolvedValueOnce(undefined);
    await saveCustomerService.execute(mockedCustomerDto);
    expect(saveCustomerRepositorySpy).toHaveBeenCalled();
  });
});
