interface Props {
  rut: string // Recibe la fecha como string desde la BD
}

const FormattedCleaningNumber: React.FC<Props> = ({ rut }) => {
  return rut.replace(/\D/g, '') // Elimina todo lo que no sea número
}

export default FormattedCleaningNumber
