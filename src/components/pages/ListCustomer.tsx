import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCustomers } from '../../api/apiConnection'
import ListGroup from 'react-bootstrap/ListGroup'
import FormattedRut from '../misc/FormattedRut'
import Pagination from '../pagination/PaginationBasic'
import { useNavigate } from 'react-router-dom'

import '../../css/listGroup.css'

// redux
import { useDispatch } from 'react-redux'
import { setSelectedCustomer } from '../../actions'

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

// Hook fuera del componente
const useWindowSize = () => {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
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

  const width = useWindowSize() // Ahora es estable y no afecta los hooks

  // Redux
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const save = (e: React.MouseEvent<HTMLDivElement>) => {
    const customerId = e.currentTarget.innerText[0] // Obtén el cliente seleccionado

    // Despachar la acción para actualizar el estado global
    dispatch(setSelectedCustomer(customerId))
    navigate('/crear-cotizacion')
  }

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error al obtener clientes</p>

  return (
    <div className="container bg-light pb-5 vh-100">
      <h1 className="mb-4 pt-4">Listar Clientes</h1>
      {customersData?.customers && customersData.customers.length > 0 ? (
        customersData.customers.map((customer: Customer) => (
          <ListGroup
            onClick={save}
            key={customer.id}
            horizontal={width >= 991}
            className="my-2 btn p-0"
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
        <p>No hay clientes disponibles.</p>
      )}
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        totalItems={customersData?.totalItems || 100}
        pageSize={pageSize}
      />
    </div>
  )
}

export default ListCustomer
