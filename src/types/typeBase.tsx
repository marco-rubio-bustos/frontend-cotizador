export interface TypeBase {
  id?: string | number
  idPrice: string
  description: string
  name?: string
  address?: string
  rut?: string
  attention?: string
  phone?: string
  email?: string
  notesGeneral?: string
  subTotal: number | string
  iva: number | string
  total: number | string
}
