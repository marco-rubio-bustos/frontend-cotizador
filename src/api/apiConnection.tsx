import axios from 'axios'

const url =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/customers'

const API_CUSTOMERS = `${url}/api/customers`
const API_QUOTATION = `${url}/api/quotation`
const API_QUOTATIONITEMS = `${url}/api/quotationItems`
const API_QUOTATIONPRICE = `${url}/api/quotationPrice`
// types
import { Customer } from '../types/customer'
import { QuotationData, QuotationItems } from '../types/quotationData'
import { PaginationParams } from '../types/paginationParams'

export const createCustomer = async (data: Customer) => {
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

export const createPriceQuote = async (data: QuotationItems) => {
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
    const response = await axios.get(`${API_CUSTOMERS}/get?all=true`)
    return response.data
  }
  // Lógica para manejar paginación si no se usa `all`
  const response = await axios.get(
    `${API_CUSTOMERS}/get?page=${page}&limit=${pageSize}`,
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

// Upgrade

export const updateCustomer = async (id: string, updatedCustomer: Customer) => {
  try {
    const response = await axios.put(
      `${API_CUSTOMERS}/update/${id}`,
      updatedCustomer,
    )
    return response.data
  } catch (error) {
    console.error('Error al actualizar cliente:', error)
    throw error
  }
}
