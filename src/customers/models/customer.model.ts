import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { Customer as ICustomer } from '../domain';

export class Customer implements ICustomer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  document: string;

  constructor(name: string, document: string, id: string = uuidv4()) {
    this.id = id;
    this.name = name;
    this.document = document;
  }

  static getCacheKey(id: string): string {
    return `customers:${id}`;
  }

  toCache(): Pick<Customer, 'name' | 'document'> {
    return {
      document: this.document,
      name: this.name,
    };
  }
}
