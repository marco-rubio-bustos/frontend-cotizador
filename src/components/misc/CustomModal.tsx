import { Button, Modal } from 'react-bootstrap'
//types
import { CustomModalMessage } from '../../types/customModalMessage'

const CustomModal: React.FC<CustomModalMessage> = ({ modalState, onHide }) => {
  const sendDataToParent = () => {
    const myData = modalState.index
    onHide(myData) // Llamas la función del padre con el dato
  }

  return (
    <Modal
      show={modalState.show}
      onHide={() => onHide(-1)} // Por si el modal se cierra manualmente
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Borrar Ítem
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mt-3">¿Esta seguro de eliminar el ítem?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={sendDataToParent}>Sí, confirmo eliminación</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CustomModal
