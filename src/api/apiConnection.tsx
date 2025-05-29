import axios from 'axios'
import { URL_API } from '../components/utils/config'

const API_CUSTOMER = `${URL_API}/api/routes/customer.php`
const API_QUOTATION = `${URL_API}/api/routes/getQuotation.php`
const API_QUOTATIONITEMS = `${URL_API}/api/routes/getQuotationItems.php`
const API_QUOTATIONPRICE = `${URL_API}/api/routes/quotationPrice.php`
const API_GETCUSTOMERS = `${URL_API}/api/routes/getCustomers.php`
const API_UPDATECUSTOMER = `${URL_API}/api/routes/updateCustomer.php`
const API_CREATEQUOTATION = `${URL_API}/api/routes/createQuotation.php`

// types
import { Customer } from '../types/customer'
import { QuotationData, QuotationItems } from '../types/quotationData'
import { PaginationParams } from '../types/paginationParams'

export const createCustomer = async (data: Customer) => {
  try {
    const response = await axios.post(API_CUSTOMER, data)
    return response.data
  } catch (error) {
    console.error('Error al crear el cliente en la base de datos:', error)
    throw error // Lanza el error para que el frontend lo maneje
  }
}

// Obtengo la data desde mutationFn: createQuotation
export const createQuotation = async (data: QuotationData) => {
  try {
    const response = await axios.post(API_CREATEQUOTATION, data)
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
    }
    return response.data
  } catch (error) {
    console.error(
      'Error al guardar la data de la cotización en la base de datos:',
      error,
    )
    throw error // Lanza el error para que el frontend lo maneje
  }
}

// Obtener
export const getCustomers = async ({
  page,
  pageSize,
  all,
}: PaginationParams) => {
  try {
    // Agregar timestamp para evitar caché
    const queryParams = all
      ? `?all=true&ts=${Date.now()}`
      : `?page=${page}&limit=${pageSize}&ts=${Date.now()}`

    // Realizar la solicitud con queryParams
    const response = await axios.get(`${API_GETCUSTOMERS}${queryParams}`)

    return response.data
  } catch (error) {
    console.error('Error al obtener clientes:', error)
    return { customers: [], error: 'No se pudo obtener los clientes.' }
  }
}

export const getQuotation = async () => {
  try {
    const response = await axios.get(`${API_QUOTATION}?ts=${Date.now()}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener cotización:", error);
    return { quotation: [], error: "No se pudo obtener la cotización." };
  }
};


export const getQuotationItems = async () => {
  const response = await axios.get(`${API_QUOTATIONITEMS}`)
  return response.data
}

// Upgrade
export const updateCustomer = async (id: string, updatedCustomer: Customer) => {
  try {
    const response = await axios.put(
      `${API_UPDATECUSTOMER}?id=${id}`,
      updatedCustomer,
    )
    return response.data
  } catch (error: any) {
    console.error(
      'Error al actualizar cliente:',
      error?.response?.data || error,
    )
    throw error
  }
}
