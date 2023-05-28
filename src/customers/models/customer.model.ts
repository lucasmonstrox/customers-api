import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

export class Customer {
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

  getCacheKey(): string {
    return `customer:${this.id}`;
  }

  toCache(): Pick<Customer, 'name' | 'document'> {
    return {
      document: this.document,
      name: this.name,
    };
  }
}
