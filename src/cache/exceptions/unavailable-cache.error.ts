import { HttpStatus } from '@nestjs/common';

export class UnavailableCacheError extends Error {
  name = 'UnavailableCache';
  statusCode = HttpStatus.BAD_GATEWAY;

  constructor() {
    super();
    this.message = 'Looks like cache is anavailable, please try again later';
  }
}
