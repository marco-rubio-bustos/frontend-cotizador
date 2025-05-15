import { Customer } from '../types/customer'

export interface SelectedCustomer {
  selectedCustomer: string
  onUpdateCustomer: (customer: Customer | null) => void
}
