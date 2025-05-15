import { Customer } from './customer'

export interface CustomersResponse {
  customers: Customer[] | undefined
  totalItems: number
}