import { HttpStatus } from '@nestjs/common';

export class UnavailableSsoException extends Error {
  name = 'UnavailableSso';
  statusCode = HttpStatus.BAD_GATEWAY;
  static message = 'Looks like sso is anavailable, please try again later';

  constructor() {
    super();
    this.message = UnavailableSsoException.message;
  }
}
