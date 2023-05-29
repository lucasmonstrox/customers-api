import { Test } from '@nestjs/testing';
import { CustomerDto } from '@/customers/dto';
import {
  CustomerIdAlreadyExists,
  CustomerNotFoundException,
} from '@/customers/exceptions';
import { Customer } from '@/customers/models';
import {
  GetCustomerRepository,
  HasCustomerByIdRepository,
  SaveCustomerRepository,
} from '@/customers/repositories';
import { UpdateCustomerService } from '@/customers/services';
import { makeCustomerDto } from '@/test/mocks/customers/dto';
import { makeCustomer } from '@/test/mocks/customers/models';

describe('UpdateCustomerService', () => {
  let getCustomerRepository: GetCustomerRepository;
  let hasCustomerByIdRepository: HasCustomerByIdRepository;
  let saveCustomerRepository: SaveCustomerRepository;
  let updateCustomerService: UpdateCustomerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetCustomerRepository,
        HasCustomerByIdRepository,
        SaveCustomerRepository,
        UpdateCustomerService,
      ],
    })
      .overrideProvider(GetCustomerRepository)
      .useValue({ execute: jest.fn() })
      .overrideProvider(HasCustomerByIdRepository)
      .useValue({ execute: jest.fn() })
      .overrideProvider(SaveCustomerRepository)
      .useValue({ execute: jest.fn() })
      .compile();
    getCustomerRepository = moduleRef.get<GetCustomerRepository>(
      GetCustomerRepository,
    );
    hasCustomerByIdRepository = moduleRef.get<HasCustomerByIdRepository>(
      HasCustomerByIdRepository,
    );
    saveCustomerRepository = moduleRef.get<SaveCustomerRepository>(
      SaveCustomerRepository,
    );
    updateCustomerService = moduleRef.get<UpdateCustomerService>(
      UpdateCustomerService,
    );
  });

  it('should throw CustomerNotFoundException when Customer not found', async () => {
    const mockedCustomer = makeCustomer();
    const mockedCustomerDto = makeCustomerDto();
    const getCustomerRepositorySpy = jest
      .spyOn(getCustomerRepository, 'execute')
      .mockResolvedValueOnce(null);
    const saveCustomerRepositorySpy = jest.spyOn(
      saveCustomerRepository,
      'execute',
    );
    await expect(
      updateCustomerService.execute(mockedCustomer.id, mockedCustomerDto),
    ).rejects.toThrow(CustomerNotFoundException);
    expect(getCustomerRepositorySpy).toHaveBeenCalledWith(mockedCustomer.id);
    expect(saveCustomerRepositorySpy).not.toHaveBeenCalled();
  });

  it('should throw CustomerIdAlreadyExists when Customer not found', async () => {
    const mockedCustomer = makeCustomer();
    const mockedCustomerDto = makeCustomerDto();
    const getCustomerRepositorySpy = jest
      .spyOn(getCustomerRepository, 'execute')
      .mockResolvedValueOnce(mockedCustomer);
    const hasCustomerByIdRepositorySpy = jest
      .spyOn(hasCustomerByIdRepository, 'execute')
      .mockResolvedValueOnce(true);
    const saveCustomerRepositorySpy = jest.spyOn(
      saveCustomerRepository,
      'execute',
    );
    await expect(
      updateCustomerService.execute(mockedCustomer.id, mockedCustomerDto),
    ).rejects.toThrow(CustomerIdAlreadyExists);
    expect(getCustomerRepositorySpy).toHaveBeenCalledWith(mockedCustomer.id);
    expect(hasCustomerByIdRepositorySpy).toHaveBeenCalledWith(
      mockedCustomerDto.id,
    );
    expect(saveCustomerRepositorySpy).not.toHaveBeenCalled();
  });

  it('should update Customer', async () => {
    const mockedCustomer = makeCustomer();
    const mockedCustomerDto = makeCustomerDto();
    const updatedCustomer = Object.assign<Customer, CustomerDto>(
      mockedCustomer,
      mockedCustomerDto,
    );
    const getCustomerRepositorySpy = jest
      .spyOn(getCustomerRepository, 'execute')
      .mockResolvedValueOnce(mockedCustomer);
    const saveCustomerRepositorySpy = jest
      .spyOn(saveCustomerRepository, 'execute')
      .mockResolvedValueOnce(undefined);
    const result = await updateCustomerService.execute(
      mockedCustomer.id,
      mockedCustomerDto,
    );
    expect(result).toStrictEqual(updatedCustomer);
    expect(getCustomerRepositorySpy).toHaveBeenCalledWith(mockedCustomer.id);
    expect(saveCustomerRepositorySpy).toHaveBeenCalledWith(updatedCustomer);
  });
});
