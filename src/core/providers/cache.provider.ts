import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const cacheFactory: Provider = {
  provide: 'CACHE',
  useFactory: (configService: ConfigService): Redis => {
    const redisInstance = new Redis(
      configService.get('REDIS_PORT'),
      configService.get('REDIS_HOST'),
    );
    return redisInstance;
  },
  inject: [ConfigService],
};
