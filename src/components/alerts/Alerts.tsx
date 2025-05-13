import Alert from 'react-bootstrap/Alert'
import '../../css/alert.css'

interface AlertProps {
  message: string
  variant: string
  show: boolean
}

const Alerts: React.FC<AlertProps> = ({ message, variant, show }) => {
  return (
    <div className="container">
      <Alert variant={variant} className={`alert z-3 ${show ? 'position-fixed' : ''}`}>
        {message}
      </Alert>
    </div>
  )
}

export default Alerts
