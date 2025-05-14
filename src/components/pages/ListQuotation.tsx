import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import ListGroup from 'react-bootstrap/ListGroup'
import Accordion from 'react-bootstrap/Accordion'
import Spinner from 'react-bootstrap/Spinner'
import { getQuotation, getQuotationItems } from '../../api/apiConnection'
import Alert from '../alerts/Alerts'
import TimeOut from '../misc/TimeOut'
import FormattedRut from '../misc/FormattedRut'
import Pagination from '../pagination/PaginationBasic'
import FormattedDate from '../misc/FormattedDate'
import useWindowSize from '../hooks/useWindowSize'
import '../../css/listGroup.css'

// Definir los tipos de los datos que esperamos recibir
type Quotation = {
  id: string
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

type QuotationItems = {
  id: string
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

type QuotationsItemsResponse = {
  quotationItems: QuotationItems[] | undefined
}

type Message = {
  success: boolean
  showAlert: string
  alertMessage: string
}

const ListQuotation: React.FC = () => {
  const [page, setPage] = useState(1)
  const [alertMessage, setAlertMessage] = useState<Message>({
    success: false,
    showAlert: '',
    alertMessage: '',
  })

  const pageSize = 20

  // consultar, obtener ("GET")
  const {
    data: quotationData,
    error,
    isLoading,
  } = useQuery<QuotationsResponse>({
    queryKey: ['quotation', page],
    queryFn: () => getQuotation({ page, pageSize }),
  })

  const { data: quotationItemsData } = useQuery<QuotationsItemsResponse>({
    queryKey: ['quotationItems', page],
    queryFn: () => getQuotationItems(),
  })

  const width = useWindowSize(window)

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
    <div className="container bg-light pb-5 px-4">
      <h1 className="mb-4 pt-4">Listar Cotizaciones</h1>
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        totalItems={quotationData?.totalItems || 100}
        pageSize={pageSize}
        showPagination={true}
      />
      {/* Mostrar los resultados filtrados */}
      {quotationData?.quotation && quotationData.quotation.length > 0 ? (
        quotationData.quotation?.map((quotation: Quotation) => (
          <Accordion key={quotation.id}>
            <Accordion.Item className="border-0" eventKey={quotation.id}>
              <Accordion.Header>
                <ListGroup
                  horizontal={typeof width === 'number' && width >= 991}
                  className="my-2 btn p-0 px-2 m-0"
                >
                  <ListGroup.Item className="col-12 col-lg-1">
                    {quotation.id}
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-lg-2">
                    {quotation.name}
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-lg-2 ">
                    {quotation.address}
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-lg-2 ">
                    <FormattedRut rut={quotation.rut} />
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-lg-1 ellipsis">
                    {quotation.attention}
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-lg-2 ellipsis">
                    {quotation.email}
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-lg-2 ellipsis">
                    <FormattedDate date={quotation.created_at} />
                  </ListGroup.Item>
                </ListGroup>
              </Accordion.Header>
              <Accordion.Body className="pb-5">
                <div className="row">
                  <div className="col-12 py-5 border-bottom">
                    <p className="m-0">
                      <b>Notas generales:</b> {quotation.notesGeneral}
                    </p>
                  </div>
                  <h3 className="py-3  border-bottom">Ítems</h3>
                </div>

                <div className="row item-title py-3">
                  <div className="col-6">Descripción </div>
                  <div className="col-2">Cantidad</div>
                  <div className="col-2">Precio unitario</div>
                  <div className="col-2">Precio total</div>
                </div>

                {quotationItemsData?.quotationItems &&
                  quotationItemsData.quotationItems.length > 0 &&
                  quotationItemsData.quotationItems
                    .filter(
                      (quotationItems: QuotationItems) =>
                        quotation.id === quotationItems.idPrice,
                    )
                    .map((quotationItems: QuotationItems) => (
                      <div
                        className="row border-bottom py-2"
                        key={quotationItems.id}
                      >
                        <div className="col-6 border-end">
                          {quotationItems.description}
                        </div>
                        <div className="col-2 border-end text-end">
                          {Number(quotationItems.qty).toLocaleString('es-ES', {
                            useGrouping: true,
                          })}
                        </div>
                        <div className="col-2 border-end px-4 d-flex justify-content-between">
                          <span>$</span>
                          <span>
                            {Number(quotationItems.priceUnit).toLocaleString(
                              'es-ES',
                              {
                                useGrouping: true,
                              },
                            )}
                          </span>
                        </div>
                        <div className="col-2 px-4 d-flex justify-content-between">
                          <span>$</span>
                          <span>
                            {Number(quotationItems.total).toLocaleString(
                              'es-ES',
                              {
                                useGrouping: true,
                              },
                            )}
                          </span>
                        </div>
                        <div className="col-12">
                          <b>Notas: </b>
                          {quotationItems.notes}
                        </div>
                      </div>
                    ))}
                <div className="row">
                  <div className="offset-8 col-4 pt-3">
                    <div className="col-12 px-3 d-flex justify-content-between">
                      <b className="col">Subtotal</b>
                      <span className="col text-end"> $ </span>
                      <span className="col text-end">
                        {' '}
                        {Number(quotation.subTotal).toLocaleString('es-ES', {
                          useGrouping: true,
                        })}
                      </span>
                    </div>
                    <div className="col-12 px-3 d-flex justify-content-between">
                      <b className="col">Iva</b>
                      <span className="col text-end"> $ </span>
                      <span className="col text-end">
                        {Number(quotation.iva).toLocaleString('es-ES', {
                          useGrouping: true,
                        })}
                      </span>
                    </div>
                    <div className="col-12 mt-3 p-3 d-flex justify-content-between bg-primary-subtle">
                      <b className="col">Total</b>
                      <span className="col text-end"> $ </span>
                      <span className="col text-end">
                        {Number(quotation.total).toLocaleString('es-ES', {
                          useGrouping: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))
      ) : (
        <>
          <TimeOut
            success={alertMessage.success}
            setAlertMessage={setAlertMessage}
          />
        <Alert
          message="No hay cotizaciones disponibles."
          variant="danger"
          show={false}
          />
          </>
      )}
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        totalItems={quotationData?.totalItems || 100}
        pageSize={pageSize}
        showPagination={true}
      />
    </div>
  )
}

export default ListQuotation
