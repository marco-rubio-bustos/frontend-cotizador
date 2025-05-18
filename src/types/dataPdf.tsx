import { Customer } from './customer'
import { QuotationItems } from './quotationData'

export interface DataPdf {
  quotations: QuotationItems[]
  quotation: number
  customer: Customer
  subTotal: number
  iva: number
  total: number
}
