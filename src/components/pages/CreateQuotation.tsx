import { useState, useEffect } from 'react'
import { Button, Form, InputGroup, Modal, ButtonGroup } from 'react-bootstrap'
import { useMutation } from '@tanstack/react-query'
import { PDFDownloadLink } from '@react-pdf/renderer'
import CreatePdf from '../pdf/Pdf' // Importa el PDF
import { createQuotation } from '../../api/apiConnection'
import {
  FormattedThousands,
  FormattedDecimals,
  FormattedPriceUnit,
} from '../misc/FormattedNumber'
import { CustomerData, CurrentNumberQuotation } from '../sections'
import Alert from '../alerts/Alerts'
import TimeOut from '../misc/TimeOut'
import CustomModal from '../misc/CustomModal'
import { cleanSpaces } from '../misc/CleanSpaces'
import PdfPrevia from '../pdf/PdfPrevia'
import { messages } from '../locales/messages'
import '../../css/form.css'
// types
import { Current, Customer, QuotationData, DataPdf, Message } from '../../types'

// redux - obtengo la funcion para guardar el cliente seleccionado
import { useSelector } from 'react-redux'

// Import the shared Customer type
import { RootState } from '../../store/store'

const CreateQuotation: React.FC = () => {
  const [dataPdf, setDataPdf] = useState<DataPdf | null>(null)
  const [pdfData, setPdfData] = useState<any>(null)
  const [modalShow, setModalShow] = useState(false)
  const [modalShowDownload, setModalShowDownload] = useState(false)

  const [form, setForm] = useState({
    description: '',
    qty: '',
    priceUnit: '',
    total: '',
    notes: '',
  })
  const [alertMessage, setAlertMessage] = useState<Message>({
    success: false,
    showAlert: '',
    alertMessage: '',
  })
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

  // React Query: useMutation para manejar la creación de la cotización
  /// crear, editar o borrar datos ("POST", "PUT", "DELETE")
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
      setAlertMessage({
        success: true,
        showAlert: messages.alert.success,
        alertMessage: messages.success.message2,
      })
    },
    onError: (error) => {
      setAlertMessage({
        success: true,
        showAlert: messages.alert.danger,
        alertMessage: messages.error.quotation.message1,
      })
      console.error(error, ' errror')
    },
  })

  // hago la multiplicacion de cantidad y precio unitario
  // y lo guardo en el total
  const handleChange = (e: React.ChangeEvent<any>, field: string) => {
    // const value = e.target.value
    const value =
      'priceUnit' === field ? e.target.value : e.target.value.replace(/\D/g, '')

    setForm((prevForm) => {
      const updatedForm = {
        ...prevForm,
        [field]: value,
      }

      // Multiplicar solo si ambos campos tienen valores numéricos
      const qty = updatedForm.qty
      const priceUnit = updatedForm.priceUnit.replace(',', '.')

      updatedForm.total =
        isNaN(Number(qty)) || isNaN(Number(priceUnit))
          ? ''
          : (Number(qty) * Number(priceUnit)).toFixed()

      return updatedForm
    })
  }

  const handleConfirmation = (event: React.FormEvent) => {
    event.preventDefault()
    setModalShowDownload(true)
  }

  const handleSave = () => {
    if (!getCustomerData) {
      setAlertMessage({
        success: true,
        showAlert: messages.alert.danger,
        alertMessage: messages.error.customer.message2,
      })
      return
    }

    if (savedQuotations.length === 0) {
      setAlertMessage({
        success: true,
        showAlert: messages.alert.danger,
        alertMessage: messages.error.quotation.message2,
      })
      return
    }

    // Combinar los datos del cliente y las cotizaciones en un único objeto
    const dataToSave: QuotationData = {
      idPrice: savedQuotations[0]?.idPrice ?? '',
      description: savedQuotations[0]?.description ?? '',
      createdCustomer: getCustomerData?.id?.toString() || '',
      name: getCustomerData.name || '',
      address: getCustomerData.address || '',
      rut: getCustomerData.rut || '',
      attention: getCustomerData.attention || '',
      phone: getCustomerData.phone || '',
      email: getCustomerData.email || '',
      notesGeneral: getCustomerData.notesGeneral || '',
      subTotal: subTotal,
      iva: iva,
      total: total,
      quotations: savedQuotations.map((quotation) => ({
        id: quotation.id,
        idPrice: String(quotation.idPrice),
        description: quotation.description,
        qty: Number(quotation.qty),
        priceUnit: Number(quotation.priceUnit.replace(',', '.')),
        total: Number(quotation.total),
        notes: quotation.notes,
      })),
    }

    mutation.mutate(dataToSave) // se envían los datos a la API, por medio de "mutationFn: createQuotation"
    setModalShowDownload(false)
  }

  const handleCreate = () => {
    if (!form.description || !form.qty || !form.priceUnit) {
      setAlertMessage({
        success: true,
        showAlert: messages.alert.danger,
        alertMessage: messages.error.general.message1,
      })
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

  // redux - obtenfo el id desde listar clientes
  const selectedCustomer = useSelector(
    (state: RootState) => state.selectedCustomer,
  )
  // fin redux

  const getQuoteObject = () => {
    return {
      quotation: (Number(getCurrent?.lastId) ?? 0) + 1,
      customer: {
        name: getCustomerData?.name || '',
        address: getCustomerData?.address || '',
        rut: getCustomerData?.rut || '',
        attention: getCustomerData?.attention || '',
        phone: getCustomerData?.phone || '',
        email: getCustomerData?.email || '',
        notesGeneral: getCustomerData?.notesGeneral || '',
      },
      quotations:
        savedQuotations?.length > 0
          ? savedQuotations
          : [
              {
                id: '',
                description: '',
                qty: '',
                priceUnit: '',
                total: '',
                notes: '',
              },
            ],
      subTotal,
      iva,
      total,
    }
  }

  useEffect(() => {
    if (!getCustomerData || savedQuotations.length === 0 || !getCurrent) {
      setDataPdf(null)
      return
    }

    const data: DataPdf = {
      quotation: (Number(getCurrent?.lastId) ?? 0) + 1,
      customer: {
        name: getCustomerData.name,
        address: getCustomerData.address,
        rut: getCustomerData.rut,
        attention: getCustomerData.attention,
        phone: getCustomerData.phone,
        email: getCustomerData.email,
        notesGeneral: getCustomerData.notesGeneral,
      },
      quotations: savedQuotations,
      subTotal,
      iva,
      total,
    }

    setDataPdf(data)
  }, [getCustomerData, savedQuotations, getCurrent, subTotal, iva, total])

  const handleViewQuote = () => {
    const data = getQuoteObject()
    setPdfData(data)
    setModalShow(true)
  }

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
      <TimeOut
        success={alertMessage.success}
        setAlertMessage={setAlertMessage}
      />
      {alertMessage.success && (
        <Alert
          message={alertMessage.alertMessage}
          variant={alertMessage.showAlert}
          showFixed={true}
          showAlert={true}
        />
      )}
      <CustomerData
        selectedCustomer={selectedCustomer}
        onUpdateCustomer={handleUpdateCustomer}
      />
      {savedQuotations.length > 0 ? (
        <>
          <div className="pt-4">
            <div className="row py-3 border-bottom d-none d-md-flex">
              <div className="col-md-11">
                <div className="row">
                  <div className="col-md-6 col-12">Descripción</div>
                  <div className="col-md-2 col-12 text-end">Cantidad</div>
                  <div className="col-md-2 col-12 text-end">
                    Precio Unitario
                  </div>
                  <div className="col-md-2 col-12 text-end">Total</div>
                </div>
              </div>
              <div className="col-md-1 text-center">Borrar</div>
            </div>

            {savedQuotations.map((quotation, index) => (
              <div className="row py-3 border-bottom" key={index}>
                <div className="col-md-11 col-10">
                  <div className="row">
                    <div className="col-md-6 col-12 pb-2 pb-md-0">
                      <span className="d-block d-md-none">
                        <b>Descripción</b>
                      </span>
                      {quotation.description}
                    </div>
                    <div className="col-md-2 col-12 text-end d-flex d-md-block justify-content-between justify-content-md-start">
                      <span className="d-block d-md-none">
                        <b>Cantidad</b>
                      </span>{' '}
                      {String(FormattedThousands({ num: quotation.qty }) || '')}
                    </div>
                    <div className="col-md-2 col-12 text-end d-flex d-md-block justify-content-between justify-content-md-start">
                      <span className="d-block d-md-none">
                        <b>Precio Unitario</b>
                      </span>
                      <span>
                        <span> $ </span>
                        {String(
                          FormattedPriceUnit({ num: quotation.priceUnit }) ||
                            '',
                        )}
                      </span>
                    </div>
                    <div className="col-md-2 col-12 text-end d-flex d-md-block justify-content-between justify-content-md-start">
                      <span className="d-block d-md-none">
                        <b>Total</b>
                      </span>
                      <span>
                        <span> $ </span>
                        {String(
                          FormattedThousands({ num: quotation.total }) || '',
                        )}
                      </span>
                    </div>
                    {quotation.notes ? (
                      <div className="col-md-12 col-12">
                        <span>
                          <b>Notas: </b>
                          {quotation.notes}
                        </span>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className="col-md-1 col-2 d-flex justify-content-center">
                  <Button
                    variant="danger"
                    className="rounded-circle btn-circle m-auto"
                    onClick={() => handleDelete(index)}
                  >
                    x
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="offset-md-8 col-md-3 col-12 py-3">
            <div className="d-flex justify-content-between px-3">
              <strong>Sub-Total:</strong>$
              {Number(subTotal).toLocaleString('es-ES', {
                useGrouping: true,
              })}
            </div>
            <div className="d-flex justify-content-between px-3 pb-3">
              <strong>Iva:</strong>
              <p className="m-0">
                <span> $ </span>
                {Number(iva).toLocaleString('es-ES', {
                  useGrouping: true,
                })}
              </p>
            </div>
            <div className="d-flex justify-content-between p-3 bg-primary-subtle">
              <strong>Total:</strong>
              <p className="m-0">
                <span> $ </span>
                {Number(total).toLocaleString('es-ES', {
                  useGrouping: true,
                })}
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="my-3 row p-3 text-black bg-danger-subtle">
          {messages.error.general.message5}
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
              value={String(FormattedThousands({ num: form.qty }) || '')} // formateo
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
                value={String(FormattedDecimals({ num: form.priceUnit }) || '')} // formateo
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
                value={String(FormattedThousands({ num: form.total }) || '')} // formateo
                readOnly
                disabled
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

          <div className="d-flex justify-content-center">
            <Button
              variant="primary"
              type="button"
              onClick={handleCreate}
              disabled={mutation.isPending}
              className="col-md-4 col-12"
            >
              {mutation.isPending ? 'Guardando...' : 'Crear Ítem'}
            </Button>
          </div>
        </div>
      </Form>

      <div className="d-flex justify-content-center">
        <ButtonGroup aria-label="Basic example" className="group">
          {!getCustomerData || savedQuotations.length === 0 ? (
            <Button className="btn btn-warning" disabled>
              Ingrese Información
            </Button>
          ) : (
            <Button onClick={handleConfirmation} className="btn btn-warning">
              Confirmar cotización
            </Button>
          )}
          <Button
            variant="primary"
            type="button"
            onClick={handleViewQuote}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Guardando...' : 'Visualizar Cotización'}
          </Button>
        </ButtonGroup>
      </div>

      <Modal
        show={modalShowDownload}
        onHide={() => setModalShowDownload(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter example-custom-modal-styling-title"
        dialogClassName="modal-90w"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Descargar PDF
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Desea descargar y guardar la cotización.</p>

          <PDFDownloadLink
            className="btn btn-warning col-md-4 col-12"
            onClick={handleSave}
            document={<CreatePdf {...(dataPdf as any)} />}
            fileName={`cotizacion_${cleanSpaces({ name: getCustomerData?.name })}_${(Number(getCurrent?.lastId) ?? 0) + 1}.pdf`}
          >
            Sí, descargar
          </PDFDownloadLink>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setModalShowDownload(false)}>
            No, volver a la cotización
          </Button>
        </Modal.Footer>
      </Modal>

      <CustomModal
        modalState={modalState}
        onHide={(data) => handleModalClose(data)}
      />

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter example-custom-modal-styling-title"
        dialogClassName="modal-90w"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            N° Cotización {(Number(getCurrent?.lastId) ?? 0) + 1}
          </Modal.Title>
        </Modal.Header>
        {pdfData && <PdfPrevia {...pdfData} />}
      </Modal>
    </div>
  )
}

export default CreateQuotation
