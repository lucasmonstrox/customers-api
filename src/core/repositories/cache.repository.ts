import { Inject, Injectable } from '@nestjs/common';
import { UnavailableCacheException } from '../exceptions';
import { Cache } from '../types';

@Injectable()
export class CacheRepository {
  constructor(
    @Inject('CACHE')
    private cache: Cache,
  ) {}

  async get<T>(key: string): Promise<T> {
    try {
      const data = await this.cache.get(key);
      const dataNotFound = !data;
      if (dataNotFound) {
        return null;
      }
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (e) {
      throw new UnavailableCacheException();
    }
  }

  async set(key: string, data: any) {
    try {
      await this.cache.set(key, JSON.stringify(data));
    } catch (e) {
      throw new UnavailableCacheException();
    }
  }
}
