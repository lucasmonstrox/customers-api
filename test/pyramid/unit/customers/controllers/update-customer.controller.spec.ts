import { Test } from '@nestjs/testing';
import { UpdateCustomerController } from '@/customers/controllers';
import { GetCustomerRepository } from '@/customers/repositories';
import { UpdateCustomerService } from '@/customers/services';
import { makeCustomerDto } from '@/test/mocks/customers/dto';
import { makeCustomer } from '@/test/mocks/customers/models';

describe('UpdateCustomerController', () => {
  let updateCustomerController: UpdateCustomerController;
  let updateCustomerService: UpdateCustomerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UpdateCustomerController],
      providers: [GetCustomerRepository, UpdateCustomerService],
    })
      .overrideProvider(GetCustomerRepository)
      .useValue({ execute: jest.fn() })
      .overrideProvider(UpdateCustomerService)
      .useValue({ execute: jest.fn() })
      .compile();
    updateCustomerController = moduleRef.get<UpdateCustomerController>(
      UpdateCustomerController,
    );
    updateCustomerService = moduleRef.get<UpdateCustomerService>(
      UpdateCustomerService,
    );
  });

  it('should return customer', async () => {
    const mockedCustomer = makeCustomer();
    const mockedCustomerDto = makeCustomerDto();
    const mockedUpdatedCustomer = Object.assign(
      mockedCustomer,
      mockedCustomerDto,
    );
    const updateCustomerServiceSpy = jest
      .spyOn(updateCustomerService, 'execute')
      .mockResolvedValueOnce(mockedUpdatedCustomer);
    const result = await updateCustomerController.execute(
      mockedCustomer.id,
      mockedCustomerDto,
    );
    expect(mockedUpdatedCustomer).toStrictEqual(result);
    expect(updateCustomerServiceSpy).toHaveBeenCalledWith(
      mockedCustomer.id,
      mockedCustomerDto,
    );
  });
});
