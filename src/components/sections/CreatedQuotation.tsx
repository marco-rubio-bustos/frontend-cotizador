import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getQuotation } from '../../api/apiConnection'
import { FormattedThousands } from '../misc/FormattedNumber'

type Quotation = {
  id: string
  createdCustomer: number
  name: string
  address: string
  rut: string
  attention: string
  email: string
  phone: string
  idPrice: string
  subTotal: string
  iva: string
  total: string
  description: string
  notesGeneral: string
  created_at: string
}

interface Props {
  quotationCustomer: string
}

type QuotationsResponse = {
  quotation: Quotation[] | undefined
  totalItems: number
}

const CreatedQuotation: React.FC<Props> = ({ quotationCustomer }) => {
  const {
    data: quotationData,
    error,
    isLoading,
  } = useQuery<QuotationsResponse>({
    queryKey: ['quotation'],
    queryFn: () => getQuotation({ all: true }),
  })

  return (
    <div className="border pt-0 p-3 mt-3">
      {quotationData?.quotation &&
      quotationData.quotation.filter(
        (quotation) => quotation.name === quotationCustomer,
      ).length > 0 ? (
        quotationData.quotation
          .filter((quotation) => quotation.name === quotationCustomer)
          .map((quotation) => (
            <div className="d-flex border-bottom" key={quotation.id}>
              <div className="col my-2">ID Cotización: {quotation.id}</div>
              <div className="col my-2 text-capitalize">
                Nombre: {quotation.name}
              </div>
              <div className="col my-2">
                Total: {}
                {String(FormattedThousands({ num: quotation.total }) || '')}
              </div>
            </div>
          ))
      ) : (
        <p className="m-0 mt-3">No hay cotizaciones creadas.</p>
      )}
    </div>
  )
}

export default CreatedQuotation
