import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { CustomerNotFoundException } from '../../../../../src/customers/exceptions';
import { CustomerByIdPipe } from '../../../../../src/customers/pipes';
import { GetCustomerRepository } from '../../../../../src/customers/repositories';
import { makeCustomer } from '../../../../mocks/customers/models';

describe('CustomerByIdPipe', () => {
  let customerByIdPipe: CustomerByIdPipe;
  let getCustomerRepository: GetCustomerRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CustomerByIdPipe],
      providers: [GetCustomerRepository],
    })
      .overrideProvider(GetCustomerRepository)
      .useValue({ execute: jest.fn() })
      .compile();
    customerByIdPipe = moduleRef.get<CustomerByIdPipe>(CustomerByIdPipe);
    getCustomerRepository = moduleRef.get<GetCustomerRepository>(
      GetCustomerRepository,
    );
  });

  it('should throw CustomerNotFoundException when customer is null', async () => {
    jest.spyOn(getCustomerRepository, 'execute').mockResolvedValueOnce(null);
    const customerId = faker.string.uuid();
    await expect(customerByIdPipe.transform(customerId)).rejects.toThrow(
      CustomerNotFoundException,
    );
  });

  it('should return Customer when Customer is found', async () => {
    const mockedCustomer = makeCustomer();
    jest
      .spyOn(getCustomerRepository, 'execute')
      .mockResolvedValueOnce(mockedCustomer);
    const result = await customerByIdPipe.transform(mockedCustomer.id);
    expect(result).toStrictEqual(mockedCustomer);
  });
});
