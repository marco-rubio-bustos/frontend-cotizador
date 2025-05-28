import { Alert } from 'react-bootstrap'
import '../../css/alert.css'
// types
import { AlertMessage } from '../../types'

const Alerts: React.FC<AlertMessage> = ({
  message,
  variant,
  showFixed,
  showAlert,
}) => {
  return (
    <div className="container">
      <Alert
        variant={variant}
        className={`${showFixed ? 'position-fixed' : ''} z-3 ${showAlert ? 'showAlert' : ''}`}
      >
        {message}
      </Alert>
    </div>
  )
}

export default Alerts
