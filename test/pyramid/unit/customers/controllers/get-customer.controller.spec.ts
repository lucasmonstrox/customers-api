import { Test } from '@nestjs/testing';
import { GetCustomerController } from '../../../../../src/customers/controllers';
import { GetCustomerService } from '../../../../../src/customers/services';
import { makeCustomer } from '../../../../mocks/customers/models';

describe('GetCustomerController', () => {
  let getCustomerController: GetCustomerController;
  let getCustomerService: GetCustomerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GetCustomerController],
      providers: [GetCustomerService],
    })
      .overrideProvider(GetCustomerService)
      .useValue({ execute: jest.fn() })
      .compile();
    getCustomerController = moduleRef.get<GetCustomerController>(
      GetCustomerController,
    );
    getCustomerService = moduleRef.get<GetCustomerService>(GetCustomerService);
  });

  it('should return customer', async () => {
    const mockedCustomer = makeCustomer();
    const getCustomerServiceSpy = jest
      .spyOn(getCustomerService, 'execute')
      .mockResolvedValueOnce(mockedCustomer);
    const result = await getCustomerController.execute(mockedCustomer.id);
    expect(result).toStrictEqual(mockedCustomer);
    expect(getCustomerServiceSpy).toHaveBeenCalledWith(mockedCustomer.id);
  });
});
