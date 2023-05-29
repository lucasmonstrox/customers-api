import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { Redis } from 'ioredis';
import { UnavailableCacheException } from '@/core/exceptions';
import { CacheRepository } from '@/core/repositories';
import { makeCustomer } from '@/test/mocks/customers/models';

describe('CacheRepository', () => {
  let cacheRepository: CacheRepository;
  let redis: Redis;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CacheRepository,
        {
          provide: 'CACHE',
          useValue: {
            get: jest.fn(),
            exists: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();
    redis = moduleRef.get<Redis>('CACHE');
    cacheRepository = moduleRef.get<CacheRepository>(CacheRepository);
  });

  describe('get', () => {
    it('should throw UnavailableCacheException when an error occurs while getting data from cache', async () => {
      const cacheKey = faker.string.uuid();
      const cacheSpy = jest.spyOn(redis, 'get').mockImplementationOnce(() => {
        throw new Error();
      });
      await expect(cacheRepository.get(cacheKey)).rejects.toThrow(
        UnavailableCacheException,
      );
      expect(cacheSpy).toHaveBeenCalledWith(cacheKey);
    });

    it('should return null ', async () => {
      const cacheKey = faker.string.uuid();
      const cacheSpy = jest.spyOn(redis, 'get').mockResolvedValueOnce(null);
      const result = await cacheRepository.get(cacheKey);
      expect(result).toBeNull();
      expect(cacheSpy).toHaveBeenCalledWith(cacheKey);
    });

    it('should return valid Object', async () => {
      const cacheKey = faker.string.uuid();
      const cacheSpy = jest
        .spyOn(redis, 'get')
        .mockResolvedValueOnce('{"name":"John","document":"123456789"}');
      const result = await cacheRepository.get(cacheKey);
      expect(result).toStrictEqual({ name: 'John', document: '123456789' });
      expect(cacheSpy).toHaveBeenCalledWith(cacheKey);
    });
  });

  describe('keyExists', () => {
    it('should throw UnavailableCacheException when an error occurs while checking key from cache', async () => {
      const cacheKey = faker.string.uuid();
      const cacheSpy = jest
        .spyOn(redis, 'exists')
        .mockImplementationOnce(() => {
          throw new Error();
        });
      await expect(cacheRepository.keyExists(cacheKey)).rejects.toThrow(
        UnavailableCacheException,
      );
      expect(cacheSpy).toHaveBeenCalledWith(cacheKey);
    });

    it('should return false when cache.exists return 0', async () => {
      const cacheKey = faker.string.uuid();
      const cacheSpy = jest.spyOn(redis, 'exists').mockResolvedValueOnce(0);
      const result = await cacheRepository.keyExists(cacheKey);
      expect(result).toBe(false);
      expect(cacheSpy).toHaveBeenCalledWith(cacheKey);
    });

    it('should return true when cache.exists return 1', async () => {
      const cacheKey = faker.string.uuid();
      const cacheSpy = jest.spyOn(redis, 'exists').mockResolvedValueOnce(1);
      const result = await cacheRepository.keyExists(cacheKey);
      expect(result).toBe(true);
      expect(cacheSpy).toHaveBeenCalledWith(cacheKey);
    });
  });

  describe('set', () => {
    it('should throw UnavailableCacheException when an error occurs while getting data from cache', async () => {
      const mockedCustomer = makeCustomer();
      const cacheKey = mockedCustomer.getCacheKey();
      const data = mockedCustomer.toCache();
      const cacheSpy = jest.spyOn(redis, 'set').mockImplementationOnce(() => {
        throw new Error();
      });
      await expect(cacheRepository.set(cacheKey, data)).rejects.toThrow(
        UnavailableCacheException,
      );
      expect(cacheSpy).toHaveBeenCalledWith(cacheKey, JSON.stringify(data));
    });

    it('should call redis.set with correctly params', async () => {
      const mockedCustomer = makeCustomer();
      const cacheKey = mockedCustomer.getCacheKey();
      const data = mockedCustomer.toCache();
      const cacheSpy = jest.spyOn(redis, 'set');
      await cacheRepository.set(cacheKey, data);
      expect(cacheSpy).toHaveBeenCalledWith(cacheKey, JSON.stringify(data));
    });
  });
});
