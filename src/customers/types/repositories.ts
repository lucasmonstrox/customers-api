import { Input } from './services';

export interface SaveCustomerRepository {
  execute(input: Input);
}
