import { Test } from '@nestjs/testing';
import { CustomerDto } from '../../../../../src/customers/dto';
import { Customer } from '../../../../../src/customers/models';
import { SaveCustomerRepository } from '../../../../../src/customers/repositories';
import { UpdateCustomerService } from '../../../../../src/customers/services';
import { makeCustomerDto } from '../../../../mocks/customers/dto/customer.dto';
import { makeCustomer } from '../../../../mocks/customers/models/customer.model';

describe('UpdateCustomerService', () => {
  let saveCustomerRepository: SaveCustomerRepository;
  let updateCustomerService: UpdateCustomerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SaveCustomerRepository, UpdateCustomerService],
    })
      .overrideProvider(SaveCustomerRepository)
      .useValue({ execute: jest.fn() })
      .compile();
    saveCustomerRepository = moduleRef.get<SaveCustomerRepository>(
      SaveCustomerRepository,
    );
    updateCustomerService = moduleRef.get<UpdateCustomerService>(
      UpdateCustomerService,
    );
  });

  it('should save new Customer', async () => {
    const mockedCustomer = makeCustomer();
    const mockedCustomerDto = makeCustomerDto();
    const updatedCustomer = Object.assign<Customer, CustomerDto>(
      mockedCustomer,
      mockedCustomerDto,
    );
    const saveCustomerRepositorySpy = jest
      .spyOn(saveCustomerRepository, 'execute')
      .mockResolvedValueOnce(undefined);
    const result = await updateCustomerService.execute(
      mockedCustomer,
      mockedCustomerDto,
    );
    expect(result).toStrictEqual(updatedCustomer);
    expect(saveCustomerRepositorySpy).toHaveBeenCalledWith(updatedCustomer);
  });
});
