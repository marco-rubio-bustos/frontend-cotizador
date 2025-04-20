interface Props {
  rut: string
}

const formatRut: React.FC<Props> = ({ rut }) => {
  // Verificar si rut es null o una cadena vacía
  if (!rut) {
    return '' // O puedes devolver un valor por defecto
  }

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
