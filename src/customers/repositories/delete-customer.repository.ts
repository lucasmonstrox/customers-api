import { Inject, Injectable } from '@nestjs/common';
import { CacheRepository } from '@/core/repositories';
import {
  CacheRepository as ICacheRepository,
  DeleteCustomerRepository as IDeleteCustomerRepository,
} from '../domain';
import { Customer } from '../models';

@Injectable()
export class DeleteCustomerRepository implements IDeleteCustomerRepository {
  constructor(
    @Inject(CacheRepository)
    private cacheRepository: ICacheRepository,
  ) {}

  async execute(customerId: string) {
    const customerCacheKey = Customer.getCacheKey(customerId);
    await this.cacheRepository.delete(customerCacheKey);
  }
}
