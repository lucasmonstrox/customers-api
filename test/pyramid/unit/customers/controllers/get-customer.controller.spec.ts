import { Test } from '@nestjs/testing';
import { GetCustomerController } from '../../../../../src/customers/controllers';
import { GetCustomerRepository } from '../../../../../src/customers/repositories';
import { makeCustomer } from '../../../../mocks/customers/models';

describe('GetCustomerController', () => {
  let getCustomerController: GetCustomerController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GetCustomerController],
      providers: [GetCustomerRepository],
    })
      .overrideProvider(GetCustomerRepository)
      .useValue({ execute: jest.fn() })
      .compile();
    getCustomerController = moduleRef.get<GetCustomerController>(
      GetCustomerController,
    );
  });

  it('should return customer', async () => {
    const mockedCustomer = makeCustomer();
    const result = getCustomerController.execute(mockedCustomer);
    expect(mockedCustomer).toBe(result);
  });
});
