import { HttpStatus } from '@nestjs/common';

export class CustomerNotFoundException extends Error {
  name = 'CustomerNotFound';
  statusCode = HttpStatus.NOT_FOUND;

  constructor(customerId: string) {
    super();
    this.message = CustomerNotFoundException.makeMessage(customerId);
  }

  static makeMessage(customerId: string): string {
    return `Customer with id "${customerId}" not found`;
  }
}
