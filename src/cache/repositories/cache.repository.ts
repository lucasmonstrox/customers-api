import { Inject, Injectable } from '@nestjs/common';
import { UnavailableCacheError } from '../errors';
import { Cache } from '../types';

@Injectable()
export class CacheRepository {
  constructor(
    @Inject('CACHE')
    private cache: Cache,
  ) {}

  // TODO: add JSON type
  async set(key: string, data: any) {
    try {
      await this.cache.set(key, JSON.stringify(data));
    } catch (e) {
      throw new UnavailableCacheError();
    }
  }
}
