import { Injectable } from '@nestjs/common';
import { CacheRepository } from '@/core/repositories';
import { DeleteCustomerRepository as IDeleteCustomerRepository } from '../domain';
import { Customer } from '../models';

@Injectable()
export class DeleteCustomerRepository implements IDeleteCustomerRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async execute(customerId: string) {
    const customerCacheKey = Customer.getCacheKey(customerId);
    await this.cacheRepository.delete(customerCacheKey);
  }
}
