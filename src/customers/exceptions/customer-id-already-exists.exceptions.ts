import { HttpStatus } from '@nestjs/common';

export class CustomerIdAlreadyExists extends Error {
  name = 'CustomerIdAlreadyExists';
  statusCode = HttpStatus.CONFLICT;

  constructor(customerId: string) {
    super();
    this.message = CustomerIdAlreadyExists.makeMessage(customerId);
  }

  static makeMessage(customerId: string): string {
    return `Customer with id "${customerId}" already exists`;
  }
}
