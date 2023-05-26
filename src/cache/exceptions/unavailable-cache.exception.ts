import { HttpStatus } from '@nestjs/common';

export class UnavailableCacheException extends Error {
  name = 'UnavailableCache';
  statusCode = HttpStatus.BAD_GATEWAY;

  constructor() {
    super();
    this.message = 'Looks like cache is anavailable, please try again later';
  }
}
