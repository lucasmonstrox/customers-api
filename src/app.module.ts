import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import * as joi from 'joi';
import { CoreModule } from './core/core.module';
import { KeycloakMiddleware } from './core/middlewares';
import { CustomerModule } from './customers/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: joi.object({
        NODE_ENV: joi
          .string()
          .valid('development', 'production', 'test')
          .default('development'),
        APP_PORT: joi.number().required(),
        KEYCLOAK_INTROSPECT_ENDPOINT: joi.string().required(),
        KEYCLOAK_CLIENT_ID: joi.string().required(),
        KEYCLOAK_CLIENT_SECRET: joi.string().required(),
        KEYCLOAK_USERNAME: joi.string().required(),
        REDIS_HOST: joi.string().required(),
        REDIS_PORT: joi.string().required(),
      }),
    }),
    HttpModule.register({}),
    RouterModule.register([
      {
        path: 'customers',
        module: CustomerModule,
      },
    ]),
    CoreModule,
    CustomerModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(KeycloakMiddleware).forRoutes('*');
  }
}
