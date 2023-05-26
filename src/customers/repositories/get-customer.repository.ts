import { Injectable } from '@nestjs/common';
import { UnavailableCacheException } from '../../cache/exceptions';
import { CacheRepository } from '../../cache/repositories';
import { Customer } from '../models/customer.model';

@Injectable()
export class GetCustomerRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async execute(customerId: string): Promise<Customer | null> {
    try {
      // TODO: assert properties when isnt null
      const customerInCache = await this.cacheRepository.get(
        `customer:${customerId}`,
      );
      const customerInCacheNotFound = !customerInCache;
      if (customerInCacheNotFound) {
        return null;
      }
      const customer = new Customer(
        customerInCache.name,
        customerInCache.document,
        customerInCache.id,
      );
      return customer;
    } catch (error) {
      throw new UnavailableCacheException();
    }
  }
}
