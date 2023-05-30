import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UnavailableSsoException } from '../exceptions';

@Injectable()
export class KeycloakMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  // TODO: add unit tests
  async use(request: FastifyRequest, _: FastifyReply, next: () => void) {
    const bearerTokenIsNotPresent = !request.headers.authorization;
    if (bearerTokenIsNotPresent) {
      throw new UnauthorizedException();
    }
    const bearerToken = request.headers.authorization;
    const [, value] = bearerToken.split(' ');
    let responseWithInfoToken;
    try {
      responseWithInfoToken = await this.httpService
        .post(
          this.configService.get('KEYCLOAK_INTROSPECT_ENDPOINT'),
          {
            token: value,
            client_secret: this.configService.get('KEYCLOAK_CLIENT_SECRET'),
            username: this.configService.get('KEYCLOAK_USERNAME'),
            client_id: this.configService.get('KEYCLOAK_CLIENT_ID'),
          },
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .toPromise();
    } catch (error) {
      throw new UnavailableSsoException();
    }
    const tokenIsNotActive = !responseWithInfoToken.data.active;
    if (tokenIsNotActive) {
      throw new UnauthorizedException();
    }
    return next();
  }
}
