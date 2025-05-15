import { useState } from 'react'
import { Form } from 'react-bootstrap'
// types
import { CreatedQuotation } from '../../types/CreatedQuotation'

const search: React.FC<CreatedQuotation> = ({ onSearchValueChange }) => {
  const [searchValue, setSearchValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    onSearchValueChange(value) // Enviar el valor al padre
  }
  return (
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Buscar</Form.Label>
        <Form.Control
          type="text"
          onChange={handleChange}
          placeholder="indique el nombre del cliente"
          value={searchValue}
        />
      </Form.Group>
    </Form>
  )
}

export default search
