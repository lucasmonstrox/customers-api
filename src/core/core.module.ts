import { Global, Module } from '@nestjs/common';
import { cacheFactory } from './providers';
import { CacheRepository } from './repositories';

@Global()
@Module({
  providers: [cacheFactory, CacheRepository],
  exports: [CacheRepository],
})
export class CoreModule {}
