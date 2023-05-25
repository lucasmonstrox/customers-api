import { Global, Module } from '@nestjs/common';
import { cacheFactory } from './providers';

@Global()
@Module({
  providers: [cacheFactory],
})
export class CommonModule {}
