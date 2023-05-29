import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { CustomerDto } from '@/customers/dto';
import {
  CustomerIdAlreadyExists,
  CustomerNotFoundException,
} from '@/customers/exceptions';
import { Customer } from '@/customers/models';
import {
  DeleteCustomerRepository,
  GetCustomerRepository,
  HasCustomerByIdRepository,
  SaveCustomerRepository,
} from '@/customers/repositories';
import { UpdateCustomerService } from '@/customers/services';
import { makeCustomerDto } from '@/test/mocks/customers/dto';
import { makeCustomer } from '@/test/mocks/customers/models';

describe('UpdateCustomerService', () => {
  let deleteCustomerRepository: DeleteCustomerRepository;
  let getCustomerRepository: GetCustomerRepository;
  let hasCustomerByIdRepository: HasCustomerByIdRepository;
  let saveCustomerRepository: SaveCustomerRepository;
  let updateCustomerService: UpdateCustomerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteCustomerRepository,
        GetCustomerRepository,
        HasCustomerByIdRepository,
        SaveCustomerRepository,
        UpdateCustomerService,
      ],
    })
      .overrideProvider(DeleteCustomerRepository)
      .useValue({ execute: jest.fn() })
      .overrideProvider(GetCustomerRepository)
      .useValue({ execute: jest.fn() })
      .overrideProvider(HasCustomerByIdRepository)
      .useValue({ execute: jest.fn() })
      .overrideProvider(SaveCustomerRepository)
      .useValue({ execute: jest.fn() })
      .compile();
    deleteCustomerRepository = moduleRef.get<DeleteCustomerRepository>(
      DeleteCustomerRepository,
    );
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
    const deleteCustomerRepositorySpy = jest.spyOn(
      deleteCustomerRepository,
      'execute',
    );
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
    expect(deleteCustomerRepositorySpy).not.toHaveBeenCalled();
    expect(saveCustomerRepositorySpy).not.toHaveBeenCalled();
  });

  it('should throw CustomerIdAlreadyExists when Customer not found', async () => {
    const mockedCustomer = makeCustomer();
    const mockedCustomerDto = makeCustomerDto();
    const deleteCustomerRepositorySpy = jest.spyOn(
      deleteCustomerRepository,
      'execute',
    );
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
    expect(deleteCustomerRepositorySpy).not.toHaveBeenCalled();
    expect(saveCustomerRepositorySpy).not.toHaveBeenCalled();
  });

  it('should update Customer and not call deleteCustomerRepository.execute when customerDto.id is equal customerId', async () => {
    const mockedCustomer = makeCustomer();
    const mockedCustomerDto = makeCustomerDto({ id: mockedCustomer.id });
    const deleteCustomerRepositorySpy = jest.spyOn(
      deleteCustomerRepository,
      'execute',
    );
    const getCustomerRepositorySpy = jest
      .spyOn(getCustomerRepository, 'execute')
      .mockResolvedValueOnce(mockedCustomer);
    const saveCustomerRepositorySpy = jest.spyOn(
      saveCustomerRepository,
      'execute',
    );
    const result = await updateCustomerService.execute(
      mockedCustomer.id,
      mockedCustomerDto,
    );
    const updatedCustomer = Object.assign<Customer, CustomerDto>(
      mockedCustomer,
      mockedCustomerDto,
    );
    expect(result).toStrictEqual(updatedCustomer);
    expect(getCustomerRepositorySpy).toHaveBeenCalledWith(mockedCustomer.id);
    expect(deleteCustomerRepositorySpy).not.toHaveBeenCalled();
    expect(saveCustomerRepositorySpy).toHaveBeenCalledWith(updatedCustomer);
  });

  it('should update Customer and call deleteCustomerRepository.execute when customerDto.id is different from customerId', async () => {
    const customerId = faker.string.uuid();
    const mockedCustomer = makeCustomer({ id: customerId });
    const mockedCustomerDto = makeCustomerDto();
    const deleteCustomerRepositorySpy = jest.spyOn(
      deleteCustomerRepository,
      'execute',
    );
    const getCustomerRepositorySpy = jest
      .spyOn(getCustomerRepository, 'execute')
      .mockResolvedValueOnce(mockedCustomer);
    const saveCustomerRepositorySpy = jest.spyOn(
      saveCustomerRepository,
      'execute',
    );
    const result = await updateCustomerService.execute(
      mockedCustomer.id,
      mockedCustomerDto,
    );
    const updatedCustomer = new Customer(
      mockedCustomerDto.name,
      mockedCustomerDto.document,
      mockedCustomerDto.id,
    );
    expect(result).toStrictEqual(updatedCustomer);
    expect(getCustomerRepositorySpy).toHaveBeenCalledWith(customerId);
    expect(deleteCustomerRepositorySpy).toHaveBeenCalledWith(customerId);
    expect(saveCustomerRepositorySpy).toHaveBeenCalledWith(updatedCustomer);
  });
});
