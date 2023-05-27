import { Test } from '@nestjs/testing';
import { UpdateCustomerController } from '../../../../../src/customers/controllers';
import { GetCustomerRepository } from '../../../../../src/customers/repositories';
import { UpdateCustomerService } from '../../../../../src/customers/services';
import { makeCustomerDto } from '../../../../mocks/customers/dto';
import { makeCustomer } from '../../../../mocks/customers/models';

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
    jest
      .spyOn(updateCustomerService, 'execute')
      .mockResolvedValueOnce(mockedUpdatedCustomer);
    const result = await updateCustomerController.execute(
      mockedCustomer,
      mockedCustomerDto,
    );
    expect(mockedUpdatedCustomer).toStrictEqual(result);
  });
});
