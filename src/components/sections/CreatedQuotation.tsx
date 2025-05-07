import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getQuotation } from '../../api/apiConnection'
import { FormattedThousands } from '../misc/FormattedNumber'
import FormattedDate from '../misc/FormattedDate'
import PdfPrevia from '../pdf/PdfPrevia'

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
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null,
  )

  const {
    data: quotationData,
    error,
    isLoading,
  } = useQuery<QuotationsResponse>({
    queryKey: ['quotation'],
    queryFn: () => getQuotation({ all: true }),
  })

  const filteredQuotations =
    (quotationData?.quotation ?? []).filter(
      (quotation) => quotation.name === quotationCustomer,
    ) || []

  // filteredQuotations.forEach((quotation) => {
  //   console.log('ID:', quotation.id)
  // })

  const save = (e: React.MouseEvent<HTMLDivElement>) => {
    const quotationId = e.currentTarget.getAttribute('data-customer-id')
    console.log('ID clickeado:', quotationId)

    const found = filteredQuotations.find((q) => String(q.id) === quotationId)

    if (found) {
      console.log('Cotización encontrada:', found)
      setSelectedQuotation(found) // Si tienes el setter activo
    } else {
      console.log('No se encontró una cotización con ese ID.')
    }
  }

  return (
    <div className="border pt-0 p-3 mt-3">
      {filteredQuotations.length > 0 ? (
        filteredQuotations.map((quotation) => (
          <div
            className="d-flex border-bottom cursor-pointer"
            key={quotation.id}
            onClick={save}
            data-customer-id={quotation.id}
          >
            <div className="col my-2">ID Cotización: {quotation.id} </div>
            <div className="col my-2 text-capitalize">
              Fecha: <FormattedDate date={quotation.created_at} />
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
      {selectedQuotation && (
        <PdfPrevia
          quotation={Number(selectedQuotation.id)}
          date={selectedQuotation.created_at}
          customer={{
            name: selectedQuotation.name,
            address: selectedQuotation.address,
            rut: selectedQuotation.rut,
            attention: selectedQuotation.attention,
            phone: selectedQuotation.phone,
            email: selectedQuotation.email,
            notesGeneral: selectedQuotation.notesGeneral,
          }}
          quotations={[
            {
              id: selectedQuotation.idPrice,
              description: selectedQuotation.description,
              qty: '1', // Puedes ajustar esto si tienes info más precisa
              priceUnit: selectedQuotation.subTotal,
              total: selectedQuotation.total,
              notes: selectedQuotation.notesGeneral,
            },
          ]}
          subTotal={Number(selectedQuotation.subTotal)}
          iva={Number(selectedQuotation.iva)}
          total={Number(selectedQuotation.total)}
        />
      )}
    </div>
  )
}

export default CreatedQuotation
