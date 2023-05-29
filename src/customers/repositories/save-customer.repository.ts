import { Inject, Injectable } from '@nestjs/common';
import { CacheRepository } from '@/core/repositories';
import {
  CacheRepository as ICacheRepository,
  SaveCustomerRepository as ISaveCustomerRepository,
} from '../domain';
import { Customer } from '../models';

@Injectable()
export class SaveCustomerRepository implements ISaveCustomerRepository {
  constructor(
    @Inject(CacheRepository)
    private cacheRepository: ICacheRepository,
  ) {}

  async execute(customer: Customer) {
    const customerCacheKey = Customer.getCacheKey(customer.id);
    const customerToCache = customer.toCache();
    await this.cacheRepository.set(customerCacheKey, customerToCache);
  }
}
