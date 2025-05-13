import axios from 'axios'

const url =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/customers'

const API_CUSTOMERS = `${url}/api/customers`
const API_QUOTATION = `${url}/api/quotation`
const API_QUOTATIONITEMS = `${url}/api/quotationItems`
const API_QUOTATIONPRICE = `${url}/api/quotationPrice`

interface CustomerData {
  name: string
  address: string
  rut: string
  attention: string
  phone: string
  email: string
  notesGeneral: string
}

interface QuotationData {
  createdCustomer: string
  name: string
  address: string
  rut: string
  attention: string
  phone: string
  email: string
  subTotal: number
  iva: number
  total: number
  notesGeneral: string
  quotations: QuotationItem[]
}

interface QuotationItem {
  idPrice: number
  description: string
  qty: number
  priceUnit: number
  total: number
  notes: string
}

export const createCustomer = async (data: CustomerData) => {
  try {
    const response = await axios.post(API_CUSTOMERS, data)
    return response.data
  } catch (error) {
    console.error('Error al crear el cliente en la base de datos:', error)
    throw error // Lanza el error para que el frontend lo maneje
  }
}

// Obtengo la data desde mutationFn: createQuotation
export const createQuotation = async (data: QuotationData) => {
  try {
    const response = await axios.post(API_QUOTATION, data)
    return response.data
  } catch (error) {
    console.error('Error al crear la cotización en la base de datos:', error)
    throw error // Lanza el error para que el frontend lo maneje
  }
}

export const createPriceQuote = async (data: QuotationItem) => {
  try {
    const response = await axios.post(API_QUOTATIONPRICE, data)
    if (response.data.idPrice) {
      console.log('Datos guardados exitosamente con ID:', response.data.idPrice)
    }
    return response.data
  } catch (error) {
    console.error('Error al crear la cotización en la base de datos:', error)
    throw error // Lanza el error para que el frontend lo maneje
  }
}

//////////////

interface PaginationParams {
  page?: number
  pageSize?: number
  all?: boolean
}

// export const getCustomers = async ({ page, pageSize }: PaginationParams) => {
//   const response = await axios.get(
//     `${API_CUSTOMERS}?page=${page}&limit=${pageSize}`,
//   )
//   return response.data
// }

export const getCustomers = async ({
  page,
  pageSize,
  all,
}: PaginationParams) => {
  if (all) {
    // Realiza una solicitud al backend para obtener todos los clientes sin paginación
    const response = await axios.get(`${API_CUSTOMERS}?all=true`)
    return response.data
  }
  // Lógica para manejar paginación si no se usa `all`
  const response = await axios.get(
    `${API_CUSTOMERS}?page=${page}&limit=${pageSize}`,
  )

  return response.data
}

export const getQuotation = async ({ page, pageSize }: PaginationParams) => {
  const response = await axios.get(
    `${API_QUOTATION}?page=${page}&limit=${pageSize}`,
  )
  return response.data
}

export const getQuotationItems = async () => {
  const response = await axios.get(`${API_QUOTATIONITEMS}`)
  return response.data
}
