import { QuotationItems } from './quotationData'

export interface QuotationsItemsResponse {
  quotationCustomer: string | number
  quotationItems: QuotationItems[] | undefined
}
