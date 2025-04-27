import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getQuotation } from '../../api/apiConnection'
import Pagination from '../pagination/PaginationBasic'
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
  const [page, setPage] = useState(1)
  const pageSize = 10

  const {
    data: quotationData,
    error,
    isLoading,
  } = useQuery<QuotationsResponse>({
    queryKey: ['quotation', page],
    queryFn: () => getQuotation({ page, pageSize }),
  })

  return (
    <>
      <div className="border pt-0 p-3 mt-3">
        {quotationData?.quotation &&
          quotationData.quotation.length > 0 &&
          // Agrupar las cotizaciones por createdCustomer
          Object.entries(
            quotationData.quotation.reduce(
              (acc: Record<number, Quotation[]>, quotation) => {
                const key = quotation.createdCustomer // Agrupar por createdCustomer
                if (!acc[key]) {
                  acc[key] = [] // Inicializar el grupo si no existe
                }
                acc[key].push(quotation) // Agregar la cotización al grupo
                return acc
              },
              {},
            ),
          ).map(([_, quotations]) => (
            <>
              {quotations.map((quotation) => {
                if (quotationCustomer === quotation.name) {
                  return (
                    <div className="d-flex border-bottom" key={quotation.id}>
                      <div className="col my-2">
                        ID Cotización: {quotation.id}
                      </div>
                      <div className="col my-2">Nombre: {quotation.name}</div>
                      <div className="col my-2">
                        Total:
                        {String(
                          FormattedThousands({ num: quotation.total }) || '',
                        )}
                      </div>
                    </div>
                  )
                } else {
                  ;('dd')
                }
              })}
            </>
          ))}
      </div>
      {quotationData?.quotation && quotationData?.quotation.length > 0 && (
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          totalItems={quotationData?.totalItems || 100}
          pageSize={pageSize}
        />
      )}
    </>
  )
}

export default CreatedQuotation
