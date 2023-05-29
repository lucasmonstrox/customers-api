export interface Customer {
  id: string;
  name: string;
  document: string;

  toCache(): Pick<Customer, 'name' | 'document'>;
}
