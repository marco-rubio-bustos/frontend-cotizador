import { QuotationItems } from './quotationData'

export interface QuotationsItemsResponse {
  quotationCustomer: string
  quotationItems: QuotationItems[] | undefined
}
