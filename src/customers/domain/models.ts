export interface Customer {
  id: string;
  name: string;
  document: string;

  toCache(): any;
}
