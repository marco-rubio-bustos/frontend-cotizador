import axios from 'axios'

const url =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/customers'

const API_URL = `${url}/api/customers`
const API_URLL = `${url}/api/quotation`

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
  description: string
  qty: string
  priceUnit: string
  total: string
  notes: string
}

export const createCustomer = async (data: CustomerData) => {
  try {
    const response = await axios.post(API_URL, data)
    return response.data
  } catch (error) {
    console.error('Error al crear el cliente en la base de datos:', error)
    throw error // Lanza el error para que el frontend lo maneje
  }
}

export const createQuotation = async (data: QuotationData) => {
  try {
    const response = await axios.post(API_URLL, data)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Error al crear la cotización en la base de datos:', error)
    throw error // Lanza el error para que el frontend lo maneje
  }
}

//////////////

interface PaginationParams {
  page: number
  pageSize: number
}

export const getCustomers = async ({ page, pageSize }: PaginationParams) => {
  const response = await axios.get(`${API_URL}?page=${page}&limit=${pageSize}`)
  return response.data
}

export const getQuotation = async ({ page, pageSize }: PaginationParams) => {
  const response = await axios.get(`${API_URLL}?page=${page}&limit=${pageSize}`)
  return response.data
}
