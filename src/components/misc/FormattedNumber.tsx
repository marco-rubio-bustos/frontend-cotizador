// types
import { Current } from '../../types'

const FormattedThousands: React.FC<Current> = ({ num }) => {
  const cleanNum = num?.replace(/\D/g, '') // Eliminar caracteres no numéricos
  return cleanNum?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const FormattedDecimals: React.FC<Current> = ({ num }) => {
  return num?.replace('.', ',')
}

const FormattedPriceUnit: React.FC<Current> = ({ num }) => {
  const parsedNum = parseFloat((num ?? '').replace(',', '.'))
  return parsedNum.toLocaleString('es-ES', {
    minimumFractionDigits: 2, // Asegura dos decimales
    useGrouping: true, // Agrega puntos de miles
  })
}

export { FormattedThousands, FormattedDecimals, FormattedPriceUnit }
