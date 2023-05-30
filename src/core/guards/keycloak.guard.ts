import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';
import { UnavailableSsoException } from '../exceptions';

// TODO: add unit tests
@Injectable()
export class KeycloakGuard extends AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const canActivate = await super.canActivate(context);
      return canActivate;
    } catch (error) {
      const isntUnauthorizedException = !(
        error instanceof UnauthorizedException
      );
      if (isntUnauthorizedException) {
        throw new UnavailableSsoException();
      }
    }
  }
}
