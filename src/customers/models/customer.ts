import { v4 as uuidv4 } from 'uuid';

export class Customer {
  id: string;
  document: string;
  name: string;

  constructor(name: string, document: string, id: string = uuidv4()) {
    this.id = id;
    this.document = document;
    this.name = name;
  }

  getCacheKey(): string {
    return `customer:${this.id}`;
  }

  // TODO: add types
  toCache() {
    return {
      id: this.id,
      document: this.document,
      name: this.name,
    };
  }
}
