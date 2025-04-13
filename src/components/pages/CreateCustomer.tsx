import { useState } from 'react'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { useMutation } from '@tanstack/react-query'
import { createCustomer } from '../../api/apiConnection'
import Alert from '../alerts/Alerts'
import '../../css/form.css'

const CreateCustomer: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    rut: '',
    attention: '',
    phone: '',
    email: '',
    notesGeneral: '',
  })
  const [success, setSuccess] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [showAlert, setShowAlert] = useState('')

  // React Query: useMutation para manejar la creación del cliente
  const mutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      setForm({
        name: '',
        address: '',
        rut: '',
        attention: '',
        phone: '',
        email: '',
        notesGeneral: '',
      })
      setSuccess(true)
      setAlertMessage('¡Se creo el nuevo cliente!')
      setShowAlert('success')
      setTimeout(() => {
        setSuccess(false)
      }, 6000)
    },
    onError: (error) => {
      setSuccess(true)
      setAlertMessage('¡Error al crear el cliente!')
      setShowAlert('danger')
      console.error('Error al crear el cliente', error)
    },
  })

  const handleSave = () => {
    mutation.mutate(form)
  }

  return (
    <div className="container bg-light pb-5 vh-100">
      <h1 className="mb-4 pt-4">Crear Cliente</h1>
      <Form className="row text-left position-relative">
        {success && <Alert message={alertMessage} variant={showAlert} />}
        <Form.Group
          className="mb-3 col-md-9 col-12"
          controlId="exampleForm.ControlInput1"
        >
          <Form.Label>Cliente</Form.Label>
          <Form.Control
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
            value={form.rut}
            onChange={(e) => setForm({ ...form, rut: e.target.value })}
          />
        </Form.Group>

        <Form.Group
          className="mb-3 col-md-6 col-12"
          controlId="exampleForm.ControlInput1"
        >
          <Form.Label>Dirección</Form.Label>
          <Form.Control
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
