import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Accordion from 'react-bootstrap/Accordion'
import Spinner from 'react-bootstrap/Spinner'
import { getCustomers, getQuotationItems } from '../../api/apiConnection'
import Alert from '../alerts/Alerts'
import FormattedRut from '../misc/FormattedRut'
import Pagination from '../pagination/PaginationBasic'
import CreatedQuotation from '../sections/CreatedQuotation'
import Search from '../sections/Search'
import useWindowSize from '../hooks/useWindowSize'
import '../../css/listGroup.css'

// redux
import { useDispatch } from 'react-redux'
import { setSelectedCustomer } from '../../actions'

// Definir los tipos de los datos que esperamos recibir
type Customer = {
  id: string
  name: string
  rut: string
  address: string
  attention: string
  phone: string
  email: string
  notesGeneral: string
}

type CustomersResponse = {
  customers: Customer[] | undefined
  totalItems: number
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

type QuotationsItemsResponse = {
  quotationItems: QuotationItems[] | undefined
}

type Message = {
  success: boolean
  showAlert: string
  alertMessage: string
}

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
    queryFn: () => getCustomers({ page, pageSize }),
  })

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

  const showPagination =
    customersData?.customers &&
    customersData.customers.filter((customer: Customer) => {
      if (!searchValue) {
        return true
      }
      return customer.name.toLowerCase().includes(searchValue.toLowerCase())
    }).length > 0

  useEffect(() => {
    if (error) {
      setAlertMessage({
        success: true,
        showAlert: 'danger',
        alertMessage: '¡Error al buscar clientes!',
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
      {customersData?.customers && customersData.customers.length > 0 ? (
        showPagination ? (
          // Aquí verificamos si el filtro devuelve algún resultado
          customersData.customers
            .filter((customer: Customer) => {
              if (!searchValue) {
                return true
              }
              return customer.name
                .toLowerCase()
                .includes(searchValue.toLowerCase())
            })
            .map((customer: Customer) => (
              <Accordion key={customer.id}>
                <Accordion.Item className="border-0" eventKey={customer.id}>
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
                        <FormattedRut rut={customer.rut} />
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
                          onClick={() => handleEdit(customer.id)}
                          variant="success"
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                    <CreatedQuotation
                      quotationCustomer={customer.name}
                      quotationItemsData={quotationItemsData?.quotationItems}
                    />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ))
        ) : (
          // Mostrar mensaje si no se encuentran datos
          <p>No se encontraron clientes con ese criterio de búsqueda.</p>
        )
      ) : (
        <Alert
          message="No hay clientes disponibles."
          variant="danger"
          show={false}
        />
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
