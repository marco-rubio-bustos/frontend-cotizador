interface Props {
  date: string // Recibe la fecha como string desde la BD
}

const FormattedDate: React.FC<Props> = ({ date }) => {
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

  return <span>{formatDate(date)}</span>
}

export default FormattedDate
