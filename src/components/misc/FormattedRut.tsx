interface Props {
  rut: string // Recibe la fecha como string desde la BD
}

const formatRut: React.FC<Props> = ({ rut }) => {
  // Eliminar puntos y guiones previos
  let cleanRut = rut.replace(/\D/g, '') // Solo números

  // Si el RUT tiene más de 1 dígito, separar el dígito verificador
  if (cleanRut.length > 1) {
    let body = cleanRut.slice(0, -1)
    let dv = cleanRut.slice(-1)
    // Agregar puntos cada tres dígitos y guion antes del dígito verificador
    return body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv
  }

  return cleanRut
}

export default formatRut
