import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CacheModule } from './cache/cache.module';
import { CustomerModule } from './customers/customer.module';

@Module({
  imports: [
    CacheModule,
    CustomerModule,
    RouterModule.register([
      {
        path: 'customers',
        module: CustomerModule,
      },
    ]),
  ],
})
export class AppModule {}
