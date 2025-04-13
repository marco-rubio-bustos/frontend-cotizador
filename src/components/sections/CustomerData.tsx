import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import { getCustomers } from '../../api/apiConnection'

type Customer = {
  id: number
  name: string
  rut: string
  address: string
  attention: string
  phone: string
  email: string
  notesGeneral: string
}

type CustomerProps = {
  selectedCustomer: string
  onUpdateCustomer: (customer: Customer | null) => void
}

const CustomerData: React.FC<CustomerProps> = ({
  selectedCustomer,
  onUpdateCustomer,
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true)
      setError(null)
      try {
        const customersData = await getCustomers({ page: 1, pageSize: 10 })

        // Verificar si customersData y customersData.customers están definidos
        if (customersData && customersData.customers) {
          const foundCustomer = customersData.customers.find(
            (c: Customer) => c.id === Number(selectedCustomer),
          )

          if (foundCustomer) {
            setCustomer(foundCustomer)
            onUpdateCustomer(foundCustomer) // Envía el objeto al padre
          } else {
            setError('Aún no ha seleccionado un cliente.')
            onUpdateCustomer(null) // Envía null si no se encuentra cliente
          }
        } else {
          setError('No se encontraron datos de clientes.')
        }
      } catch (err) {
        setError('Error al obtener los datos del cliente.')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [selectedCustomer])

  if (loading) {
    return <p>Cargando datos del cliente...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="row border-bottom pb-5">
      <h3 className="mb-4 pt-4">Datos del cliente</h3>
      <Form.Group className="mb-3 col-md-9 col-12" controlId="formName">
        <Form.Label>Cliente</Form.Label>
        <Form.Control value={customer?.name || ''} readOnly />
      </Form.Group>

      <Form.Group className="mb-3 col-md-3 col-12" controlId="formRut">
        <Form.Label>Rut</Form.Label>
        <Form.Control value={customer?.rut || ''} readOnly />
      </Form.Group>

      <Form.Group className="mb-3 col-md-6 col-12" controlId="formAddress">
        <Form.Label>Dirección</Form.Label>
        <Form.Control value={customer?.address || ''} readOnly />
      </Form.Group>

      <Form.Group className="mb-3 col-md-3 col-12" controlId="formAttention">
        <Form.Label>Atención</Form.Label>
        <Form.Control value={customer?.attention || ''} readOnly />
      </Form.Group>

      <Form.Group className="mb-3 col-md-3 col-12" controlId="formPhone">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control value={customer?.phone || ''} readOnly />
      </Form.Group>

      <Form.Group className="mb-3 col-md-4 col-12" controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control value={customer?.email || ''} readOnly />
      </Form.Group>

      <Form.Group className="mb-3 col-md-8 col-12" controlId="formNotes">
        <Form.Label>Notas Generales</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={customer?.notesGeneral || ''}
          readOnly
        />
      </Form.Group>
    </div>
  )
}

export default CustomerData
