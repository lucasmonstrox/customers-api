import { Inject, Injectable } from '@nestjs/common';
import { UnavailableCacheError } from '../exceptions';
import { Cache } from '../types';

@Injectable()
export class CacheRepository {
  constructor(
    @Inject('CACHE')
    private cache: Cache,
  ) {}

  async get(key: string) {
    try {
      const data = await this.cache.get(key);
      const dataNotFound = !!data;
      if (dataNotFound) {
        return JSON.parse(data);
      }
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (e) {
      throw new UnavailableCacheError();
    }
  }

  // TODO: add JSON type
  async set(key: string, data: any) {
    try {
      await this.cache.set(key, JSON.stringify(data));
    } catch (e) {
      throw new UnavailableCacheError();
    }
  }
}
