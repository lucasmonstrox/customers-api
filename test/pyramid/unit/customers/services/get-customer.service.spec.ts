import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { CustomerNotFoundException } from '../../../../../src/customers/exceptions';
import { GetCustomerRepository } from '../../../../../src/customers/repositories';
import { GetCustomerService } from '../../../../../src/customers/services';
import { makeCustomer } from '../../../../mocks/customers/models';

describe('GetCustomerService', () => {
  let getCustomerService: GetCustomerService;
  let getCustomerRepository: GetCustomerRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GetCustomerService],
      providers: [GetCustomerRepository],
    })
      .overrideProvider(GetCustomerRepository)
      .useValue({ execute: jest.fn() })
      .compile();
    getCustomerService = moduleRef.get<GetCustomerService>(GetCustomerService);
    getCustomerRepository = moduleRef.get<GetCustomerRepository>(
      GetCustomerRepository,
    );
  });

  it('should throw CustomerNotFoundException when customer is null', async () => {
    const getCustomerRepositorySpy = jest
      .spyOn(getCustomerRepository, 'execute')
      .mockResolvedValueOnce(null);
    const customerId = faker.string.uuid();
    await expect(getCustomerService.execute(customerId)).rejects.toThrow(
      CustomerNotFoundException,
    );
    expect(getCustomerRepositorySpy).toHaveBeenCalledWith(customerId);
  });

  it('should return Customer when Customer is found', async () => {
    const mockedCustomer = makeCustomer();
    const getCustomerRepositorySpy = jest
      .spyOn(getCustomerRepository, 'execute')
      .mockResolvedValueOnce(mockedCustomer);
    const result = await getCustomerService.execute(mockedCustomer.id);
    expect(result).toStrictEqual(mockedCustomer);
    expect(getCustomerRepositorySpy).toHaveBeenCalledWith(mockedCustomer.id);
  });
});
