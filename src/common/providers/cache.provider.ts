import Redis from 'ioredis';

export const cacheFactory = {
  provide: 'CACHE',
  useFactory: () => {
    // TODO: add redis config
    return new Redis();
  },
};
