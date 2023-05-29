import { Injectable } from '@nestjs/common';
import { CacheRepository } from '@/core/repositories';
import { Customer } from '../models';

@Injectable()
export class DeleteCustomerRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async execute(customerId: string) {
    const customerCacheKey = Customer.getCacheKey(customerId);
    await this.cacheRepository.delete(customerCacheKey);
  }
}
