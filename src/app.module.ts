import { Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';
import { CustomerModule } from './customers/customer.module';

@Module({
  imports: [CacheModule, CustomerModule],
})
export class AppModule {}
