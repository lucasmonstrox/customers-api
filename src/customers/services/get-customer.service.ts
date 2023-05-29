import { Inject, Injectable } from '@nestjs/common';
import {
  GetCustomerService as IGetCustomerService,
  GetCustomerRepository as IGetCustomerRepository,
} from '../domain';
import { CustomerNotFoundException } from '../exceptions';
import { GetCustomerRepository } from '../repositories';

@Injectable()
export class GetCustomerService implements IGetCustomerService {
  constructor(
    @Inject(GetCustomerRepository)
    private getCustomerRepository: IGetCustomerRepository,
  ) {}

  async execute(
    customerId: string,
  ): ReturnType<IGetCustomerService['execute']> {
    const customer = await this.getCustomerRepository.execute(customerId);
    const customerNotFound = !customer;
    if (customerNotFound) {
      throw new CustomerNotFoundException(customerId);
    }
    return customer;
  }
}
