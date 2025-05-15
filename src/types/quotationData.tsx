export interface QuotationData {
  createdCustomer: string
  name: string
  address: string
  rut: string
  attention: string
  phone: string
  email: string
  notesGeneral: string
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
