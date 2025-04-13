import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getQuotation } from '../../api/apiConnection'
import ListGroup from 'react-bootstrap/ListGroup'
// import FormattedRut from '../misc/FormattedRut'
import Pagination from '../pagination/PaginationBasic'
import '../../css/listGroup.css'

// Definir los tipos de los datos que esperamos recibir
type Quotation = {
  id: string
  name: string
  address: string
  rut: string
  attention: string
  email: string
}

type QuotationsResponse = {
  quotation: Quotation[] | undefined
  totalItems: number
}

const ListQuotation: React.FC = () => {
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
    <div className="container bg-light pb-5 vh-100">
      <h1 className="mb-4 pt-4">Listar Cotizaciones</h1>
      {quotationData?.quotation && quotationData.quotation.length > 0 ? (
        quotationData.quotation.map((quotation: Quotation) => (
          <ListGroup
            key={quotation.id}
            horizontal={width >= 991}
            className="my-2"
          >
            <ListGroup.Item className="col-12 col-lg-1">
              {quotation.id}
            </ListGroup.Item>
            <ListGroup.Item className="col-12 col-lg-3">
              {quotation.name}
            </ListGroup.Item>
            <ListGroup.Item className="col-12 col-lg-2">
              {quotation.address}
            </ListGroup.Item>
            <ListGroup.Item className="col-12 col-lg-2">
              {quotation.rut}
            </ListGroup.Item>
            <ListGroup.Item className="col-12 col-lg-2">
              {quotation.attention}
            </ListGroup.Item>
            <ListGroup.Item className="col-12 col-lg-2 ellipsis">
              {quotation.email}
            </ListGroup.Item>
          </ListGroup>
        ))
      ) : (
        <p>No hay clientes disponibles.</p> // Mensaje cuando no hay clientes
      )}
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        totalItems={quotationData?.totalItems || 100} // Usa el valor totalItems si está disponible
        pageSize={pageSize}
      />
    </div>
  )
}

export default ListQuotation
