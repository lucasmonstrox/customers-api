import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
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
