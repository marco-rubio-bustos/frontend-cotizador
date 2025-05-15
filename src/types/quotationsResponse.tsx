import { Quotation } from './quotation'

export interface QuotationsResponse {
  quotation: Quotation[] | undefined
  totalItems: number
}
