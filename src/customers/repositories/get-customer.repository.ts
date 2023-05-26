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
      const customer = await this.cacheRepository.get(`customer:${customerId}`);
      return customer;
    } catch (error) {
      throw new UnavailableCacheException();
    }
  }
}
