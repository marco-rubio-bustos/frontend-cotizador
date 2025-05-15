import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Spinner, Form } from 'react-bootstrap'
import { FormatRut } from '../misc/FormattedRut'
import { getCustomers } from '../../api/apiConnection'
// types
import { Customer } from '../../types/customer'
import { SelectedCustomer } from '../../types/selectedCustomer'

const CustomerData: React.FC<SelectedCustomer> = ({
  selectedCustomer,
  onUpdateCustomer,
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true)
      setError(null)
      try {
        const customersData = await getCustomers({ all: true, onPageChange: () => {} })

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
    return (
      <>
        <p>Cargando datos del cliente...</p>{' '}
        <Spinner animation="grow" variant="warning" />
      </>
    )
  }

  if (error) {
    return (
      <p className="my-3 text-black row p-3 d-flex align-items-center justify-content-between bg-danger-subtle">
        {error}

        <Link to="/listar-clientes" className="col-md-4 btn btn-primary">
          Agregar Cliente
        </Link>
      </p>
    )
  }

  return (
    <div className="row border-bottom pb-5">
      <h3 className="mb-4 pt-4">Datos del cliente</h3>
      <Form.Group className="mb-3 col-md-9 col-12" controlId="formName">
        <Form.Label>Cliente</Form.Label>
        <Form.Control
          className="text-capitalize"
          value={customer?.name || ''}
          readOnly
          disabled
        />
      </Form.Group>

      <Form.Group className="mb-3 col-md-3 col-12" controlId="formRut">
        <Form.Label>Rut</Form.Label>
        <div className="form-control bg-input-disabled" aria-disabled="true">
          <FormatRut rut={customer?.rut || ''} />
        </div>
      </Form.Group>

      <Form.Group className="mb-3 col-md-6 col-12" controlId="formAddress">
        <Form.Label>Dirección</Form.Label>
        <Form.Control
          className="text-capitalize"
          value={customer?.address || ''}
          readOnly
          disabled
        />
      </Form.Group>

      <Form.Group className="mb-3 col-md-3 col-12" controlId="formAttention">
        <Form.Label>Atención</Form.Label>
        <Form.Control
          className="text-capitalize"
          value={customer?.attention || ''}
          readOnly
          disabled
        />
      </Form.Group>

      <Form.Group className="mb-3 col-md-3 col-12" controlId="formPhone">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control value={customer?.phone || ''} readOnly disabled />
      </Form.Group>

      <Form.Group className="mb-3 col-md-4 col-12" controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control value={customer?.email || ''} readOnly disabled />
      </Form.Group>

      <Form.Group className="mb-3 col-md-8 col-12" controlId="formNotes">
        <Form.Label>Notas Generales</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={customer?.notesGeneral || ''}
          readOnly
          disabled
        />
      </Form.Group>
    </div>
  )
}

export default CustomerData
