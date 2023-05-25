import { Injectable } from '@nestjs/common';
import { CacheRepository } from 'src/cache/repositories';
import { Customer } from '../models/customer';

@Injectable()
export class SaveCustomerRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async execute(customer: Customer) {
    const customerCacheKey = customer.getCacheKey();
    const customerToCache = customer.toCache();
    await this.cacheRepository.set(customerCacheKey, customerToCache);
  }
}
