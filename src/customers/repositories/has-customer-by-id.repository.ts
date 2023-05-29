import { Injectable } from '@nestjs/common';
import { UnavailableCacheException } from '@/core/exceptions';
import { CacheRepository } from '@/core/repositories';
import { Customer } from '../models';

@Injectable()
export class HasCustomerByIdRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async execute(customerId: string): Promise<boolean> {
    try {
      const customerCacheKey = Customer.getCacheKey(customerId);
      const hasCustomerById = await this.cacheRepository.keyExists(
        customerCacheKey,
      );
      return hasCustomerById;
    } catch (error) {
      throw new UnavailableCacheException();
    }
  }
}
