import { Inject, Injectable } from '@nestjs/common';
import { CacheRepository } from '@/core/repositories';
import {
  CacheRepository as ICacheRepository,
  GetCustomerRepository as IGetCustomerRepository,
} from '../domain';
import { Customer } from '../models';

@Injectable()
export class GetCustomerRepository implements IGetCustomerRepository {
  constructor(
    @Inject(CacheRepository)
    private cacheRepository: ICacheRepository,
  ) {}

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
