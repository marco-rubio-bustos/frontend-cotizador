//types
import { Current } from '../../types/current'

const FormattedDate: React.FC<Current> = ({ date }) => {
  const formatDate = (dateString: string) => {
    const fecha = new Date(dateString)
    return fecha
      .toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '/')
  }

  return <span>{date ? formatDate(date) : 'Invalid date'}</span>
}

export default FormattedDate
