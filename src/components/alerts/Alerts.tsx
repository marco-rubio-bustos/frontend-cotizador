import Alert from 'react-bootstrap/Alert'
import '../../css/alert.css'

interface AlertProps {
  message: string
  variant: string
}

const Alerts: React.FC<AlertProps> = ({ message, variant }) => {
  return (
    <div className="container">
      <Alert variant={variant} className="alert position-fixed">
        {message}
      </Alert>
    </div>
  )
}

export default Alerts
