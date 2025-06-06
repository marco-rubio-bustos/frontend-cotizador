import { useEffect } from 'react'
// type
import { TimeOut } from '../../types'

const AutoHideAlert: React.FC<TimeOut> = ({ success, setAlertMessage }) => {
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setAlertMessage({ success: false, showAlert: '', alertMessage: '' })
      }, 6000)

      return () => clearTimeout(timer) // Limpia el timeout si el componente se desmonta
    }
  }, [success, setAlertMessage])

  return null // No renderiza nada, solo maneja el estado
}

export default AutoHideAlert
