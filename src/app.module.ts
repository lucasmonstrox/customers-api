import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { CacheModule } from './cache/cache.module';
import { CustomerModule } from './customers/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
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
