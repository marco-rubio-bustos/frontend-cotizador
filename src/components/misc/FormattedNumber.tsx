interface Props {
  num: string
}

const FormattedThousands: React.FC<Props> = ({ num }) => {
  let cleanNum = num.replace(/\D/g, '') // Solo números
  return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const FormattedDecimals: React.FC<Props> = ({ num }) => {
  return num.replace('.', ',')
}

const FormattedPriceUnit: React.FC<Props> = ({ num }) => {
  const parsedNum = parseFloat(num.replace(',', '.'))
  return parsedNum.toLocaleString('es-ES', {
    minimumFractionDigits: 2, // Asegura dos decimales
    useGrouping: true, // Agrega puntos de miles
  })
}

export { FormattedThousands, FormattedDecimals, FormattedPriceUnit }
