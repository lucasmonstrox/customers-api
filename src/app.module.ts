import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import * as joi from 'joi';
import {
  AuthGuard,
  KeycloakConnectModule,
  KeycloakConnectOptions,
  RoleGuard,
} from 'nest-keycloak-connect';
import { CacheModule } from './cache/cache.module';
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
        KEYCLOAK_AUTH_SERVER_URL: joi.string().required(),
        KEYCLOAK_REALM: joi.string().required(),
        KEYCLOAK_CLIENT_ID: joi.string().required(),
        KEYCLOAK_SECRET: joi.string().required(),
        REDIS_HOST: joi.string().required(),
        REDIS_PORT: joi.string().required(),
      }),
    }),
    CacheModule,
    KeycloakConnectModule.registerAsync({
      useFactory: (configService: ConfigService): KeycloakConnectOptions => {
        const keycloakConnectOptions: KeycloakConnectOptions = {
          authServerUrl: configService.get('KEYCLOAK_AUTH_SERVER_URL'),
          realm: configService.get('KEYCLOAK_REALM'),
          clientId: configService.get('KEYCLOAK_CLIENT_ID'),
          secret: configService.get('KEYCLOAK_SECRET'),
        };
        return keycloakConnectOptions;
      },
      inject: [ConfigService],
    }),
    RouterModule.register([
      {
        path: 'customers',
        module: CustomerModule,
      },
    ]),
    CustomerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
