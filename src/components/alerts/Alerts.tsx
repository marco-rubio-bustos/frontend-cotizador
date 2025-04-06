import Alert from 'react-bootstrap/Alert'
import '../../css/alert.css'

interface AlertProps {
  message: string
  variant: string
}

const Alerts: React.FC<AlertProps> = ({ message, variant }) => {
  return (
    <Alert variant={variant} className="alert position-absolute">
      {message}
    </Alert>
  )
}

export default Alerts
