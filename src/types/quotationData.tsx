

import { TypeBase } from './typeBase'

export interface QuotationData extends TypeBase {
  createdCustomer: string
  subTotal: number
  iva: number
  total: number
  quotations: QuotationItems[]
}

export interface QuotationItems {
  id: number
  idPrice: string
  description: string
  qty: number
  priceUnit: number
  total: number
  notes: string
}
