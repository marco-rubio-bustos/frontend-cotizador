import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Form } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { getCustomers, updateCustomer } from '../../api/apiConnection'
import { FormatRut } from '../misc/FormattedRut'
import FormattedCleaningNumber from '../misc/FormattedCleaningNumber'
import Alert from '../alerts/Alerts'
import TimeOut from '../misc/TimeOut'
import '../../css/form.css'
// types
import { Message, Customer, CustomersResponse } from '../../types'

const CreateCustomer: React.FC = () => {
  const [form, setForm] = useState({
    id: '',
    name: '',
    address: '',
    rut: '',
    attention: '',
    phone: '',
    email: '',
    notesGeneral: '',
  })
  const [alertMessage, setAlertMessage] = useState<Message>({
    success: false,
    showAlert: '',
    alertMessage: '',
  })

  const {
    data: customersData,
    error,
    isLoading,
  } = useQuery<CustomersResponse>({
    queryKey: ['customers'],
    queryFn: () => getCustomers({ all: true, onPageChange: () => {} }),
  })

  const { id } = useParams()

  // React Query: useMutation para manejar la creación del cliente
  const mutation = useMutation({
    mutationFn: (updatedCustomer: Customer) =>
      updateCustomer(String(updatedCustomer.id), updatedCustomer), // Asegurar que el ID y los datos sean enviados

    onSuccess: () => {
      setForm({
        id: '',
        name: '',
        address: '',
        rut: '',
        attention: '',
        phone: '',
        email: '',
        notesGeneral: '',
      })
      setAlertMessage({
        success: true,
        showAlert: 'success',
        alertMessage: '¡Se actualizo el cliente!',
      })
    },
    onError: () => {
      setAlertMessage({
        success: true,
        showAlert: 'danger',
        alertMessage: `¡Error al actualizar el cliente!`,
      })
    },
  })

  // Filtro segun el id enviado
  const filteredCustomer = customersData?.customers?.filter(
    (customer: Customer) => Number(customer.id) === Number(id),
  )

  useEffect(() => {
    if (filteredCustomer && filteredCustomer.length > 0) {
      setForm((prevForm) => {
        // Solo actualiza si los valores son diferentes
        if (JSON.stringify(prevForm) !== JSON.stringify(filteredCustomer[0])) {
          return {
            ...prevForm,
            ...filteredCustomer[0],
            id: String(filteredCustomer[0].id),
          }
        }
        return prevForm
      })
    }
  }, [customersData])

  const navigate = useNavigate()

  const handleSave = () => {
    mutation.mutate({ ...form, id: Number(form.id), 
    notesGeneral: form.notesGeneral ?? '',  })
    setTimeout(() => {
      navigate('/listar-clientes')
    }, 3000)
  }

  return (
    <div className="container bg-light pb-5 px-4">
      {filteredCustomer?.map((customer: Customer) => (
        <>
          <h1 className="mb-4 pt-4">Editar Cliente</h1>
          <Form className="row text-left position-relative" key={customer.id}>
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
            <Form.Group
              className="mb-3 col-md-9 col-12"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                className="text-capitalize"
                type="text"
                placeholder=""
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group
              className="mb-3 col-md-3 col-12"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Rut</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={String(FormatRut({ rut: form.rut }) || '')} // formateo
                onChange={
                  (e) =>
                    setForm({
                      ...form,
                      rut: String(
                        FormattedCleaningNumber({ rut: e.target.value }) || '',
                      ),
                    }) // FormattedCleaningNumber
                }
              />
            </Form.Group>

            <Form.Group
              className="mb-3 col-md-6 col-12"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                className="text-capitalize"
                type="email"
                placeholder=""
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </Form.Group>

            <Form.Group
              className="mb-3 col-md-3 col-12"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Atención</Form.Label>
              <Form.Control
                className="text-capitalize"
                type="text"
                placeholder=""
                value={form.attention}
                onChange={(e) =>
                  setForm({ ...form, attention: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group
              className="mb-3 col-md-3 col-12"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Form.Group>

            <Form.Group
              className="mb-3 col-md-4 col-12"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder=""
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group
              className="mb-3 col-md-8 col-12"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Notas Generales</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.notesGeneral}
                onChange={(e) =>
                  setForm({ ...form, notesGeneral: e.target.value })
                }
              />
            </Form.Group>

            <Button
              variant="primary"
              type="button"
              onClick={handleSave}
              disabled={mutation.isPending}
              className="offset-md-4 col-md-4 col-12"
            >
              {mutation.isPending ? 'Guardando...' : 'Actualizar Cliente'}
            </Button>
          </Form>
        </>
      ))}
    </div>
  )
}

export default CreateCustomer
