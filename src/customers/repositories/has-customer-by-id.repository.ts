import { Injectable } from '@nestjs/common';
import { CacheRepository } from '@/core/repositories';
import { HasCustomerByIdRepository as IHasCustomerByIdRepository } from '../domain';
import { Customer } from '../models';

@Injectable()
export class HasCustomerByIdRepository implements IHasCustomerByIdRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async execute(
    customerId: string,
  ): ReturnType<IHasCustomerByIdRepository['execute']> {
    const customerCacheKey = Customer.getCacheKey(customerId);
    const hasCustomerById = await this.cacheRepository.keyExists(
      customerCacheKey,
    );
    return hasCustomerById;
  }
}
