// types
import { Customer } from '../../types'

const FormattedCleaningNumber: React.FC<Customer> = ({ rut }) => {
  return rut?.replace(/\D/g, '') // Elimina todo lo que no sea número
}

export default FormattedCleaningNumber
