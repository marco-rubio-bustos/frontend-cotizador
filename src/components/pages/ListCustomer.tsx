import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCustomers } from '../../api/apiConnection'
import ListGroup from 'react-bootstrap/ListGroup'
import FormattedRut from '../misc/FormattedRut'
import Pagination from '../pagination/PaginationBasic'
import '../../css/listGroup.css'

// Definir los tipos de los datos que esperamos recibir
type Customer = {
  id: string
  name: string
  rut: string
  attention: string
  phone: string
  email: string
}

type CustomersResponse = {
  customers: Customer[] | undefined
  totalItems: number
}

const ListCustomer: React.FC = () => {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const {
    data: customersData,
    error,
    isLoading,
  } = useQuery<CustomersResponse>({
    queryKey: ['customers', page],
    queryFn: () => getCustomers({ page, pageSize }),
  })

  const useWindowSize = () => {
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth)

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return width
  }

  const width = useWindowSize()

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error al obtener clientes</p>

  return (
    <div className="container bg-light">
      <h1 className="mb-4 pt-4">Listar Clientes</h1>
      {customersData?.customers && customersData.customers.length > 0 ? (
        customersData.customers.map((customer: Customer) => (
          <ListGroup
            key={customer.id}
            horizontal={width >= 991}
            className="my-2"
          >
            <ListGroup.Item className="col-12 col-lg-1">
              {customer.id}
            </ListGroup.Item>
            <ListGroup.Item className="col-12 col-lg-3">
              {customer.name}
            </ListGroup.Item>
            <ListGroup.Item className="col-12 col-lg-2">
              <FormattedRut rut={customer.rut} />
            </ListGroup.Item>
            <ListGroup.Item className="col-12 col-lg-2">
              {customer.attention}
            </ListGroup.Item>
            <ListGroup.Item className="col-12 col-lg-2">
              {customer.phone}
            </ListGroup.Item>
            <ListGroup.Item className="col-12 col-lg-2 ellipsis">
              {customer.email}
            </ListGroup.Item>
          </ListGroup>
        ))
      ) : (
        <p>No hay clientes disponibles.</p> // Mensaje cuando no hay clientes
      )}
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        totalItems={customersData?.totalItems || 100} // Usa el valor totalItems si está disponible
        pageSize={pageSize}
      />
    </div>
  )
}

export default ListCustomer
