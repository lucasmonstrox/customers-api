import { Injectable } from '@nestjs/common';
import { UnavailableCacheException } from '@/core/exceptions';
import { CacheRepository } from '@/core/repositories';

@Injectable()
export class HasCustomerByIdRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async execute(customerId: string): Promise<boolean> {
    try {
      const hasCustomerById = await this.cacheRepository.keyExists(customerId);
      return hasCustomerById;
    } catch (error) {
      throw new UnavailableCacheException();
    }
  }
}
