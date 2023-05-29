import { Injectable } from '@nestjs/common';
import { CacheRepository } from '@/core/repositories';
import { SaveCustomerRepository as ISaveCustomerRepository } from '../domain';
import { Customer } from '../models';

@Injectable()
export class SaveCustomerRepository implements ISaveCustomerRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async execute(customer: Customer) {
    const customerCacheKey = Customer.getCacheKey(customer.id);
    const customerToCache = customer.toCache();
    await this.cacheRepository.set(customerCacheKey, customerToCache);
  }
}
