import { Test } from '@nestjs/testing';
import { CreateCustomerController } from '@/customers/controllers';
import { CreateCustomerService } from '@/customers/services';
import { makeCreateCustomerDto } from '@/test/mocks/customers/dto';
import { makeCustomer } from '@/test/mocks/customers/models';

describe('CreateCustomerController', () => {
  let createCustomerController: CreateCustomerController;
  let createCustomerService: CreateCustomerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CreateCustomerController],
      providers: [CreateCustomerService],
    })
      .overrideProvider(CreateCustomerService)
      .useValue({ execute: jest.fn() })
      .compile();
    createCustomerController = moduleRef.get<CreateCustomerController>(
      CreateCustomerController,
    );
    createCustomerService = moduleRef.get<CreateCustomerService>(
      CreateCustomerService,
    );
  });

  it('should return customer', async () => {
    const mockedCustomer = makeCustomer();
    const createCustomerServiceSpy = jest
      .spyOn(createCustomerService, 'execute')
      .mockResolvedValueOnce(mockedCustomer);
    const mockedCreateCustomerDto = makeCreateCustomerDto();
    const result = await createCustomerController.execute(
      mockedCreateCustomerDto,
    );
    expect(mockedCustomer).toStrictEqual(result);
    expect(createCustomerServiceSpy).toHaveBeenCalledWith(
      mockedCreateCustomerDto,
    );
  });
});
