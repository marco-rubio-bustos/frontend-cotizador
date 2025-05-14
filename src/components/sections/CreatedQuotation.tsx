import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getQuotation } from '../../api/apiConnection'
import { FormattedThousands } from '../misc/FormattedNumber'
import Modal from 'react-bootstrap/Modal'
import FormattedDate from '../misc/FormattedDate'
import Alert from '../alerts/Alerts'
import TimeOut from '../misc/TimeOut'
import Spinner from 'react-bootstrap/Spinner'
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
  quotationItemsData?: QuotationItem[] /// 1
}

/// 2
type QuotationItem = {
  idPrice: string
  description: string
  qty: string
  priceUnit: string
  total: string
  notes: string
}

type QuotationsResponse = {
  quotation: Quotation[] | undefined
  totalItems: number
}

type Message = {
  success: boolean
  showAlert: string
  alertMessage: string
}

/// 3
const CreatedQuotation: React.FC<Props> = ({
  quotationCustomer,
  quotationItemsData,
}) => {
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null,
  )

  const [modalShow, setModalShow] = useState(false)
  const [alertMessage, setAlertMessage] = useState<Message>({
    success: false,
    showAlert: '',
    alertMessage: '',
  })

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
    setModalShow(true)
    const quotationId = e.currentTarget.getAttribute('data-customer-id')
    const found = filteredQuotations.find((q) => String(q.id) === quotationId)
    if (found) {
      setSelectedQuotation(found) // Si tienes el setter activo
    }
  }

  useEffect(() => {
    if (error) {
      setAlertMessage({
        success: true,
        showAlert: 'danger',
        alertMessage: '¡Error al buscar cotizaciones!',
      })
    }
  }, [error])

  if (isLoading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="grow" variant="warning" />
      </div>
    )

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center">
        <TimeOut
          success={alertMessage.success}
          setAlertMessage={setAlertMessage}
        />
        {alertMessage.success && (
          <Alert
            message={alertMessage.alertMessage}
            variant={alertMessage.showAlert}
            show={true}
          />
        )}
      </div>
    )

  return (
    <div className="border pt-0 p-3 mt-3">
      {filteredQuotations.length > 0 ? (
        filteredQuotations.map((quotation) => (
          <div
            className="d-flex border-bottom px-3 cursor-pointer"
            key={quotation.id}
            onClick={save}
            data-customer-id={quotation.id}
          >
            <div className="col my-2">N° Cotización: {quotation.id} </div>
            <div className="col my-2 text-capitalize">
              Fecha: <FormattedDate date={quotation.created_at} />
            </div>
            <div className="col my-2">
              Total: {}${' '}
              {String(FormattedThousands({ num: quotation.total }) || '')}
            </div>
          </div>
        ))
      ) : (
        <p className="m-0 mt-3">No hay cotizaciones creadas.</p>
      )}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter example-custom-modal-styling-title"
        dialogClassName="modal-90w"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            N° Cotización {Number(selectedQuotation?.id)}
          </Modal.Title>
        </Modal.Header>

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
            quotations={
              quotationItemsData
                ? quotationItemsData
                    .filter((item) => item.idPrice === selectedQuotation.id)
                    .map((item) => ({
                      id: item.idPrice,
                      description: item.description,
                      qty: item.qty,
                      priceUnit: item.priceUnit,
                      total: item.total,
                      notes: item.notes,
                    }))
                : []
            }
            subTotal={Number(selectedQuotation.subTotal)}
            iva={Number(selectedQuotation.iva)}
            total={Number(selectedQuotation.total)}
          />
        )}
      </Modal>
    </div>
  )
}

export default CreatedQuotation
