import { useState } from 'react'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { useMutation } from '@tanstack/react-query'
import { createQuotation } from '../../api/apiConnection'
import FormattedNumber from '../misc/FormattedNumber'
import InputGroup from 'react-bootstrap/InputGroup'
import Alert from '../alerts/Alerts'
import '../../css/form.css'

const CreateQuotation: React.FC = () => {
  const [form, setForm] = useState({
    description: '',
    qty: '',
    priceUnit: '',
    total: '',
    notes: '',
  })
  const [success, setSuccess] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [showAlert, setShowAlert] = useState('')

  // React Query: useMutation para manejar la creación de la cotización
  const mutation = useMutation({
    mutationFn: createQuotation, // Función que envía los datos a la API
    // Se ejecuta si la API responde con éxito
    onSuccess: () => {
      setForm({
        description: '',
        qty: '',
        priceUnit: '',
        total: '',
        notes: '',
      }) // Limpia el formulario después de guardar
      setSuccess(true)
      setAlertMessage('¡Se creo la cotización correctamente!')
      setShowAlert('success')
      setTimeout(() => {
        setSuccess(false)
      }, 6000)
    },
    onError: (error) => {
      setSuccess(true)
      setAlertMessage('¡Hubo un error al crear la cotización!')
      setShowAlert('danger')
      console.error('Error al crear la cotización', error)
    },
  })

  // hago la multiplicacion de cantidad y precio unitario
  // y lo guardo en el total
  const handleChange = (e: React.ChangeEvent<any>, field: string) => {
    const value = e.target.value

    setForm((prevForm) => {
      const updatedForm = {
        ...prevForm,
        [field]: value,
      }

      // Multiplicar solo si ambos campos tienen valores numéricos
      const qty = Number(updatedForm.qty)
      const priceUnit = Number(updatedForm.priceUnit)

      updatedForm.total =
        isNaN(qty) || isNaN(priceUnit) ? '' : (qty * priceUnit).toString()

      return updatedForm
    })
  }

  const save = () => {
    mutation.mutate(form) // se envían los datos a la API
  }

  const create = () => {
    if (!form.qty || !form.priceUnit) {
      console.log(111)
      return
    }
    console.log(555)
  }

  return (
    <div className="container bg-light">
      <h1 className="mb-4 pt-4">Crear Cotización</h1>
      <Form className="row text-left position-relative">
        {success && <Alert message={alertMessage} variant={showAlert} />}
        <div className="row">
          <Form.Group
            className="mb-3 col-md-5 col-12"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group
            className="mb-3 col-md-2 col-12"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              value={FormattedNumber(form.qty)}
              onChange={(e) => handleChange(e, 'qty')}
            />
          </Form.Group>
          <Form.Group
            className="mb-3 col-md-2 col-12"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label className="ellipsis">Precio unitario</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={FormattedNumber(form.priceUnit)}
              onChange={(e) => handleChange(e, 'priceUnit')}
            />
          </Form.Group>

          <Form.Group
            className="mb-3 col-md-3 col-12"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label className="ellipsis">Precio total</Form.Label>
            <InputGroup className="mb-3 mb-3 col-md-2 col-12">
              <Form.Control
                className="border-0"
                type="text"
                placeholder=""
                value={FormattedNumber(form.total)}
                readOnly
              />
              <Button
                variant="primary"
                type="button"
                className="rounded-5 ms-3"
                onClick={create}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Guardando...' : '+'}
              </Button>
            </InputGroup>
          </Form.Group>
        </div>

        <Form.Group
          className="mb-3 col-md-12 col-12"
          controlId="exampleForm.ControlTextarea1"
        >
          <Form.Label>Notas</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="button"
          onClick={save}
          disabled={mutation.isPending}
          className="offset-md-4 col-md-4 col-12"
        >
          {mutation.isPending ? 'Guardando...' : 'Crear Cotización'}
        </Button>
      </Form>
    </div>
  )
}

export default CreateQuotation
