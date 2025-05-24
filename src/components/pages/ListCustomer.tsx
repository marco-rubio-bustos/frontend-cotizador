import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Button, ListGroup, Accordion, Spinner } from 'react-bootstrap'
import { getCustomers, getQuotationItems } from '../../api/apiConnection'
import Alert from '../alerts/Alerts'
import TimeOut from '../misc/TimeOut'
import { FormatRut } from '../misc/FormattedRut'
import Pagination from '../pagination/PaginationBasic'
import { CreatedQuotation, Search } from '../sections'
import useWindowSize from '../hooks/useWindowSize'
import { messages } from '../locales/messages'
import '../../css/listGroup.css'

// redux
import { useDispatch } from 'react-redux'
import { setSelectedCustomer } from '../../actions'
// type
import {
  Customer,
  CustomersResponse,
  Message,
  QuotationsItemsResponse,
} from '../../types'

const ListCustomer: React.FC = () => {
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(1)
  const [alertMessage, setAlertMessage] = useState<Message>({
    success: false,
    showAlert: '',
    alertMessage: '',
  })

  const pageSize = 10
  const {
    data: customersData,
    error,
    isLoading,
  } = useQuery<CustomersResponse>({
    queryKey: ['customers', page],
    queryFn: () => getCustomers({ page, pageSize, onPageChange: () => {} }),
  })

  const { data: allCustomersData } = useQuery<CustomersResponse>({
    queryKey: ['allCustomers'],
    queryFn: () => getCustomers({ all: true, onPageChange: () => {} }), // backend debería ignorar paginación si `all=true`
  })

  const filteredCustomers = allCustomersData?.customers?.filter((customer) =>
    customer.name?.toLowerCase().includes(searchValue.toLowerCase()),
  )

  const customersToShow =
    searchValue === ''
      ? customersData?.customers // los paginados (pageSize)
      : filteredCustomers // todos los que calcen con el filtro

  const showPagination =
    searchValue === '' && (customersData?.totalItems ?? 0) > pageSize

  const { data: quotationItemsData } = useQuery<QuotationsItemsResponse>({
    queryKey: ['quotationItems', page],
    queryFn: () => getQuotationItems(),
  })

  const width = useWindowSize(window)

  // Redux
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSave = (e: React.MouseEvent<HTMLDivElement>) => {
    const customerId = e.currentTarget.getAttribute('data-customer-id') // Obtén el ID completo
    if (customerId) {
      // Despachar la acción para actualizar el estado global
      dispatch(setSelectedCustomer(customerId))
      navigate('/crear-cotizacion')
    }
  }

  const handleEdit = (customerId: string) => {
    navigate(`/editar-cliente/${customerId}`)
  }

  // Manejo del valor de búsqueda desde el hijo
  const handleSearchValueChange = (value: string) => {
    setSearchValue(value)
  }

  useEffect(() => {
    if (error) {
      setAlertMessage({
        success: true,
        showAlert: messages.alert.danger,
        alertMessage: messages.error.customer.message4,
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
    <div className="container bg-light pb-5 px-4">
      <h1 className="mb-4 pt-4">Listar Clientes</h1>
      <Search onSearchValueChange={handleSearchValueChange} />
      {showPagination && (
        // Mostrar el paginador solo si hay resultados
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          totalItems={customersData?.totalItems || 100}
          pageSize={pageSize}
          showPagination={showPagination ?? false}
        />
      )}
      {/* Mostrar los resultados filtrados */}
      {customersToShow && customersToShow?.length > 0 ? (
        customersToShow?.map((customer: Customer) => (
          <Accordion key={customer.id}>
            <Accordion.Item className="border-0" eventKey={String(customer.id)}>
              <Accordion.Header className="rounded-0">
                <ListGroup
                  onClick={handleSave}
                  horizontal={typeof width === 'number' && width >= 991}
                  className="my-2 btn p-0 px-2 m-0"
                  data-customer-id={customer.id}
                >
                  <ListGroup.Item className="col-12 col-lg-1">
                    {customer.id}
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-lg-3 text-capitalize">
                    {customer.name}
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-lg-2">
                    <FormatRut rut={customer.rut} />
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-lg-2 text-capitalize">
                    {customer.attention}
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-lg-2">
                    {customer.phone}
                  </ListGroup.Item>
                  <ListGroup.Item className="col-12 col-lg-2 ellipsis">
                    {customer.email}
                  </ListGroup.Item>
                </ListGroup>
              </Accordion.Header>
              <Accordion.Body>
                <div className="row">
                  <div className="col-10">
                    <div className="col-12">
                      <b>Dirección: </b>
                      {customer.address}
                    </div>
                    <div className="col-12">
                      <b>Notas Generales: </b>
                      {customer.notesGeneral}
                    </div>
                  </div>
                  <div className="col-2">
                    <Button
                      onClick={() => handleEdit(String(customer.id))}
                      variant="success"
                    >
                      Editar
                    </Button>
                  </div>
                </div>
                <CreatedQuotation
                  quotationCustomer={customer.id || ''}
                  quotationItems={quotationItemsData?.quotationItems}
                />
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
            message={messages.error.customer.message5}
            variant={alertMessage.showAlert}
            show={false}
          />
        </>
      )}
      {showPagination && (
        // Mostrar el paginador solo si hay resultados
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          totalItems={customersData?.totalItems || 100}
          pageSize={pageSize}
          showPagination={showPagination ?? false}
        />
      )}
    </div>
  )
}

export default ListCustomer
