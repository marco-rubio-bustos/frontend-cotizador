import { Alert } from 'react-bootstrap'
import '../../css/alert.css'
// types
import { AlertMessage } from '../../types/alertMessage'

const Alerts: React.FC<AlertMessage> = ({ message, variant, show }) => {
  return (
    <div className="container">
      <Alert
        variant={variant}
        className={`alert z-3 ${show ? 'position-fixed' : ''}`}
      >
        {message}
      </Alert>
    </div>
  )
}

export default Alerts
