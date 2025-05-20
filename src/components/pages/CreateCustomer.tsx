import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useMutation } from '@tanstack/react-query'
import { createCustomer } from '../../api/apiConnection'
import FormattedCleaningNumber from '../misc/FormattedCleaningNumber'
import { FormatRut } from '../misc/FormattedRut'
import Alert from '../alerts/Alerts'
import TimeOut from '../misc/TimeOut'
import '../../css/form.css'
// types
import { Message } from '../../types'

const CreateCustomer: React.FC = () => {
  const [form, setForm] = useState({
    id: 0, // Valor por defecto
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

  // React Query: useMutation para manejar la creación del cliente
  const mutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      setForm({
        id: 0,
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
        alertMessage: '¡Se creo el nuevo cliente!',
      })
    },
    onError: () => {
      setAlertMessage({
        success: true,
        showAlert: 'danger',
        alertMessage: `¡Error al crear el cliente!`,
      })
    },
  })

  const handleSave = () => {
    mutation.mutate(form)
  }

  return (
    <div className="container bg-light pb-5 px-4">
      <h1 className="mb-4 pt-4">Crear Cliente</h1>
      <Form className="row text-left position-relative">
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
            onChange={(e) => setForm({ ...form, attention: e.target.value })}
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
            onChange={(e) => setForm({ ...form, notesGeneral: e.target.value })}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="button"
          onClick={handleSave}
          disabled={mutation.isPending}
          className="offset-md-4 col-md-4 col-12"
        >
          {mutation.isPending ? 'Guardando...' : 'Crear Cliente'}
        </Button>
      </Form>
    </div>
  )
}

export default CreateCustomer
