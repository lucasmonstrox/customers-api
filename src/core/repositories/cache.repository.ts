import { Inject, Injectable } from '@nestjs/common';
import { UnavailableCacheException } from '../exceptions';
import { Redis } from 'ioredis';

@Injectable()
export class CacheRepository {
  constructor(
    @Inject('CACHE')
    private redis: Redis,
  ) {}

  async get<T>(key: string): Promise<T> {
    try {
      const data = await this.redis.get(key);
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

  async keyExists(key: string): Promise<boolean> {
    try {
      const keyExists = (await this.redis.exists(key)) > 0;
      return keyExists;
    } catch (e) {
      throw new UnavailableCacheException();
    }
  }

  async set(key: string, data: any) {
    try {
      await this.redis.set(key, JSON.stringify(data));
    } catch (e) {
      throw new UnavailableCacheException();
    }
  }
}
