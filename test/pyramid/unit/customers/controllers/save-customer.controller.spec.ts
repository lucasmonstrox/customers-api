import { Test } from '@nestjs/testing';
import { SaveCustomerController } from '@/customers/controllers';
import { SaveCustomerService } from '@/customers/services';
import { makeCustomerDto } from '@/test/mocks/customers/dto';
import { makeCustomer } from '@/test/mocks/customers/models';

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
    const saveCustomerServiceSpy = jest
      .spyOn(saveCustomerService, 'execute')
      .mockResolvedValueOnce(mockedCustomer);
    const mockedCustomerDto = makeCustomerDto();
    const result = await saveCustomerController.execute(mockedCustomerDto);
    expect(mockedCustomer).toStrictEqual(result);
    expect(saveCustomerServiceSpy).toHaveBeenCalledWith(mockedCustomerDto);
  });
});
