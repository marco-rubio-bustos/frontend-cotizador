import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getQuotation, getCustomers } from '../../api/apiConnection'
import { FormattedThousands } from '../misc/FormattedNumber'
import { Modal, Spinner } from 'react-bootstrap'
import FormattedDate from '../misc/FormattedDate'
import Alert from '../alerts/Alerts'
import TimeOut from '../misc/TimeOut'
import PdfPrevia from '../pdf/PdfPrevia'
import { messages } from '../locales/messages'
// types
import {
  Quotation,
  Customer,
  Message,
  QuotationsResponse,
  QuotationsItemsResponse,
} from '../../types'

const CreatedQuotation: React.FC<QuotationsItemsResponse> = ({
  quotationCustomer,
  quotationItems,
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
    queryFn: () => getQuotation({ all: true, onPageChange: () => {} }),
  })

  const { data: customerData } = useQuery<{ customers: Customer[] }>({
    queryKey: ['customer'],
    queryFn: () => getCustomers({ all: true, onPageChange: () => {} }),
  })

  const filteredQuotations =
    (quotationData?.quotation ?? []).filter(
      (quotation) =>
        String(quotation.createdCustomer) === String(quotationCustomer),
    ) || []

  const filteredCustomer = customerData?.customers?.find(
    (customer) => customer.id === quotationCustomer,
  )

  const handleSave = (e: React.MouseEvent<HTMLDivElement>) => {
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
        showAlert: messages.alert.danger,
        alertMessage: messages.error.quotation.message3,
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
            onClick={handleSave}
            data-customer-id={quotation.id}
          >
            <div className="col my-2">N° Cotización: {quotation.id} </div>
            <div className="col my-2 text-capitalize">
              Fecha: <FormattedDate date={quotation.created_at} />
            </div>
            <div className="col my-2">
              Total: $
              <FormattedThousands num={String(quotation.total)} />
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
              name: filteredCustomer?.name ?? '',
              address: filteredCustomer?.address ?? '',
              rut: filteredCustomer?.rut ?? '',
              attention: filteredCustomer?.attention ?? '',
              phone: filteredCustomer?.phone ?? '',
              email: filteredCustomer?.email ?? '',
              notesGeneral: filteredCustomer?.notesGeneral ?? '',
            }}
            quotations={
              quotationItems
                ? quotationItems
                    .filter((item) => item.idPrice === selectedQuotation.id)
                    .map((item) => ({
                      id: item.idPrice,
                      description: item.description,
                      qty: String(item.qty),
                      priceUnit: String(item.priceUnit),
                      total: String(item.total),
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
