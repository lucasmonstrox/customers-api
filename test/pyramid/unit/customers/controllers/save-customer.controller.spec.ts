import { Test } from '@nestjs/testing';
import { SaveCustomerController } from '../../../../../src/customers/controllers';
import { SaveCustomerService } from '../../../../../src/customers/services';
import { makeCustomerDto } from '../../../../mocks/customers/dto/customer.dto';
import { makeCustomer } from '../../../../mocks/customers/models/customer.model';

describe('SaveCustomerController', () => {
  let saveCustomerController: SaveCustomerController;
  let saveCustomerService: SaveCustomerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SaveCustomerController],
      providers: [SaveCustomerService],
    })
      .overrideProvider(SaveCustomerService)
      .useValue({ execute: jest.fn() })
      .compile();
    saveCustomerController = moduleRef.get<SaveCustomerController>(
      SaveCustomerController,
    );
    saveCustomerService =
      moduleRef.get<SaveCustomerService>(SaveCustomerService);
  });

  it('should return customer', async () => {
    const mockedCustomer = makeCustomer();
    jest
      .spyOn(saveCustomerService, 'execute')
      .mockResolvedValueOnce(mockedCustomer);
    const mockedCustomerDto = makeCustomerDto();
    const result = await saveCustomerController.execute(mockedCustomerDto);
    expect(mockedCustomer).toStrictEqual(result);
  });
});
