import { Injectable } from '@nestjs/common';
import { CacheRepository } from '@/core/repositories';
import { Customer } from '../models';

@Injectable()
export class SaveCustomerRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async execute(customer: Customer) {
    const customerCacheKey = customer.getCacheKey();
    const customerToCache = customer.toCache();
    await this.cacheRepository.set(customerCacheKey, customerToCache);
  }
}
