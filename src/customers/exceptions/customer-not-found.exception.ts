import { HttpStatus } from '@nestjs/common';

export class CustomerNotFoundException extends Error {
  name = 'CustomerNotFound';
  statusCode = HttpStatus.NOT_FOUND;

  constructor(customerId: string) {
    super();
    this.message = `Customer with id "${customerId}" not found`;
  }
}
