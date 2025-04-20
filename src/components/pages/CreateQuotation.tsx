import { useState } from 'react'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { useMutation } from '@tanstack/react-query'
import { createQuotation } from '../../api/apiConnection'
import FormattedNumber from '../misc/FormattedNumber'
import CustomerData from '../sections/CustomerData'
import CurrentNumberQuotation from '../sections/CurrentNumberQuotation'
import Alert from '../alerts/Alerts'
import CustomModal from '../misc/CustomModal'
import '../../css/form.css'

// redux - obtengo la funcion para guardar el cliente seleccionado
import { useSelector } from 'react-redux'

// Import the shared Customer type
import { RootState } from '../../store/store'

type Current = {
  number: number
  lastId: number
}

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

type QuotationData = {
  name: string
  address: string
  rut: string
  attention: string
  phone: string
  email: string
  notesGeneral: string
  subTotal: number
  iva: number
  total: number
  quotations: QuotationItem[]
}

type QuotationItem = {
  idPrice: number
  description: string
  qty: number
  priceUnit: number
  total: number
  notes: string
}

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
  const [savedQuotations, setSavedQuotations] = useState<any[]>([])
  const [nextId, setNextId] = useState(1)
  const [modalState, setModalState] = useState<{
    show: boolean
    index: number
  }>({
    show: false,
    index: 0,
  })
  const [getCustomerData, setGetCustomerData] = useState<Customer | null>(null)
  const [getCurrent, setGetCurrent] = useState<Current | null>(null)

  const timeout = () => {
    setTimeout(() => {
      setSuccess(false)
    }, 6000)
  }

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
      setAlertMessage(`¡Se creó la cotización correctamente!`)
      setShowAlert('success')
      timeout()
    },
    onError: (error) => {
      setSuccess(true)
      setAlertMessage('¡Hubo un error al crear la cotización!')
      setShowAlert('danger')
      timeout()
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
        isNaN(qty) || isNaN(priceUnit) ? '' : (qty * priceUnit).toFixed()

      return updatedForm
    })
  }

  const handleSave = () => {
    if (!getCustomerData) {
      setSuccess(true)
      setAlertMessage('¡No se seleccionó ningún cliente!')
      setShowAlert('danger')
      timeout()
      return
    }

    if (savedQuotations.length === 0) {
      setSuccess(true)
      setAlertMessage('¡No hay cotizaciones guardadas!')
      setShowAlert('danger')
      timeout()
      return
    }

    // Combinar los datos del cliente y las cotizaciones en un único objeto
    const dataToSave: QuotationData = {
      name: getCustomerData.name,
      address: getCustomerData.address,
      rut: getCustomerData.rut,
      attention: getCustomerData.attention,
      phone: getCustomerData.phone,
      email: getCustomerData.email,
      notesGeneral: getCustomerData.notesGeneral,
      subTotal: subTotal,
      iva: iva,
      total: total,
      quotations: savedQuotations.map((quotation) => ({
        idPrice: quotation.id,
        description: quotation.description,
        qty: quotation.qty,
        priceUnit: quotation.priceUnit,
        total: quotation.total,
        notes: quotation.notes,
      })),
    }
    console.log(dataToSave)

    mutation.mutate(dataToSave) // se envían los datos a la API
  }

  const handleCreate = () => {
    if (!form.description || !form.qty || !form.priceUnit) {
      setSuccess(true)
      setAlertMessage('¡Hay campos sin llenar!')
      setShowAlert('danger')
      timeout()
      return
    }
    // Preparar el objeto para guardar
    const quotationData = {
      id: nextId,
      description: form.description,
      qty: form.qty,
      priceUnit: form.priceUnit,
      total: form.total,
      notes: form.notes,
      getCustomerData,
    }

    // Agregar la cotización al estado
    setSavedQuotations((prev) => [...prev, quotationData])

    // Incrementamos el contador para el próximo ID
    setNextId((prevId) => prevId + 1)

    // Limpiar el formulario
    setForm({
      description: '',
      qty: '',
      priceUnit: '',
      total: '',
      notes: '',
    })
  }

  const handleDelete = (index: number) => {
    setModalState({ show: true, index })
  }

  // recibo el dato del hijo modal
  const handleModalClose = (index: number) => {
    setSavedQuotations((prev) => prev.filter((_, i) => i !== index))
    setModalState({ show: false, index: 0 })
  }

  // recibo el dato del hijo CustomerData
  const handleUpdateCustomer = (customer: Customer | null) => {
    setGetCustomerData(customer)
  }

  const handleUpdateCurrentNumber = (current: Current | null) => {
    setGetCurrent(current) // No se esta utilizando
  }

  const subTotal = savedQuotations.reduce((acc, item) => {
    return acc + Number(item.total)
  }, 0)

  const iva = subTotal * 0.19
  const total = subTotal + iva

  // redux
  const selectedCustomer = useSelector(
    (state: RootState) => state.selectedCustomer,
  )
  // fin redux

  return (
    <div className="container bg-light pb-5 px-4">
      <CustomModal
        modalState={modalState}
        onHide={(data) => handleModalClose(data)}
      />
      <div className="d-flex justify-content-between align-items-center mb-4 pt-4">
        <h1 className="m-0">Crear Cotización</h1>
        <CurrentNumberQuotation
          onUpdateCurrentNumber={handleUpdateCurrentNumber}
        />
      </div>
      {success && <Alert message={alertMessage} variant={showAlert} />}
      <CustomerData
        selectedCustomer={selectedCustomer}
        onUpdateCustomer={handleUpdateCustomer}
      />
      {savedQuotations.length > 0 ? (
        <>
          <div className="pt-4">
            <div className="row py-3 border-bottom">
              <div className="col-md-5 col-12">Descripción</div>
              <div className="col-md-2 col-12 text-end">Cantidad</div>
              <div className="col-md-2 col-12 text-end">Precio Unitario</div>
              <div className="col-md-2 col-12 text-end">Total</div>
              <div className="col-md-1 col-12 text-center">Borrar</div>
            </div>

            {savedQuotations.map((quotation, index) => (
              <div className="row py-3 border-bottom" key={index}>
                <div className="col-md-5 col-12">{quotation.description}</div>
                <div className="col-md-2 col-12 text-end">
                  {Number(quotation.qty).toLocaleString('es-ES', {
                    useGrouping: true,
                  })}
                </div>
                <div className="col-md-2 col-12 text-end">
                  $
                  {Number(quotation.priceUnit).toLocaleString('es-ES', {
                    useGrouping: true,
                  })}
                </div>
                <div className="col-md-2 col-12 text-end">
                  $
                  {Number(quotation.total).toLocaleString('es-ES', {
                    useGrouping: true,
                  })}
                </div>
                <div className="col-md-1 col-12">
                  <Button
                    variant="danger"
                    className="rounded-circle btn-circle m-auto"
                    onClick={() => handleDelete(index)}
                  >
                    x
                  </Button>
                </div>
                <div className="col-md-12 col-12">{quotation.notes}</div>
              </div>
            ))}
          </div>

          <div className="offset-8 col-md-3 col-12 pt-3">
            <div className="d-flex justify-content-between">
              <strong>Sub-Total:</strong>$
              {Number(subTotal).toLocaleString('es-ES', {
                useGrouping: true,
              })}
            </div>
            <div className="d-flex justify-content-between">
              <strong>Iva:</strong>$
              {Number(iva).toLocaleString('es-ES', {
                useGrouping: true,
              })}
            </div>
            <div className="d-flex justify-content-between">
              <strong>Total:</strong>$
              {Number(total).toLocaleString('es-ES', {
                useGrouping: true,
              })}
            </div>
          </div>
        </>
      ) : (
        <p className="my-3 row p-3 text-black bg-danger-subtle">
          Aún no ha agregado ítems a la cotización.
        </p>
      )}
      <Form className="text-left position-relative">
        <div className="row py-5 bg-secondary-subtle">
          <Form.Group
            className="mb-3 col-md-6 col-12"
            controlId="controlIdDescription"
          >
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              className="capitalize border-0"
              type="text"
              placeholder=""
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3 col-md-2 col-12" controlId="controlIdQty">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="text"
              className="border-0"
              value={String(FormattedNumber({ num: form.qty }) || '')} // formateo
              onChange={(e) => handleChange(e, 'qty')}
            />
          </Form.Group>

          <Form.Group
            className="mb-3 col-md-2 col-12"
            controlId="controlIdPriceUnit"
          >
            <Form.Label className="ellipsis">Precio unitario</Form.Label>
            <InputGroup>
              <InputGroup.Text className="border-0">$</InputGroup.Text>
              <Form.Control
                className="border-0"
                type="text"
                placeholder=""
                value={String(FormattedNumber({ num: form.priceUnit }) || '')} // formateo
                onChange={(e) => handleChange(e, 'priceUnit')}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group
            className="mb-3 col-md-2 col-12"
            controlId="controlIdTotal"
          >
            <Form.Label className="text-end">Precio total</Form.Label>
            <InputGroup>
              <InputGroup.Text className="border-0">$</InputGroup.Text>
              <Form.Control
                className="border-0"
                type="text"
                placeholder=""
                value={String(FormattedNumber({ num: form.total }) || '')} // formateo
                readOnly
              />
            </InputGroup>
          </Form.Group>

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
            onClick={handleCreate}
            disabled={mutation.isPending}
            className="offset-md-4 col-md-4 col-12"
          >
            {mutation.isPending ? 'Guardando...' : 'Crear Ítem'}
          </Button>
        </div>
        <Button
          variant="info"
          type="button"
          onClick={handleSave}
          disabled={mutation.isPending}
          className="offset-md-4 col-md-4 col-12 mt-5"
        >
          {mutation.isPending ? 'Guardando...' : 'Crear Cotización'}
        </Button>
      </Form>
    </div>
  )
}

export default CreateQuotation
