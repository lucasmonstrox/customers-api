import { Customer } from '.';

export type Input = Pick<Customer, 'document' | 'name'>;
export type SavedUserOutput = Promise<Customer>;
export interface SaveCustomerService {
  execute(input: Input): SavedUserOutput;
}
