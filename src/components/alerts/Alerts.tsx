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
        className={` z-3 ${showFixed ? 'position-fixed' : ''} ${showAlert ? 'showAlert' : ''}`}
      >
        {message}
      </Alert>
    </div>
  )
}

export default Alerts
