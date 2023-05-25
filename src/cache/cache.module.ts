import { Global, Module } from '@nestjs/common';
import { cacheFactory } from './factories';
import { CacheRepository } from './repositories/cache.repository';

@Global()
@Module({
  providers: [cacheFactory, CacheRepository],
  exports: [CacheRepository],
})
export class CacheModule {}
