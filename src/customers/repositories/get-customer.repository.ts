import { Injectable } from '@nestjs/common';
import { CacheRepository } from '@/core/repositories';
import { GetCustomerRepository as IGetCustomerRepository } from '../domain';
import { Customer } from '../models';

@Injectable()
export class GetCustomerRepository implements IGetCustomerRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async execute(
    customerId: string,
  ): ReturnType<IGetCustomerRepository['execute']> {
    // TODO: assert properties when isnt null
    const customerInCache = await this.cacheRepository.get<Customer>(
      Customer.getCacheKey(customerId),
    );
    const customerInCacheNotFound = !customerInCache;
    if (customerInCacheNotFound) {
      return null;
    }
    const customer = new Customer(
      customerInCache.name,
      customerInCache.document,
      customerId,
    );
    return customer;
  }
}
