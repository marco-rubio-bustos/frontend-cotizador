export interface TimeOut {
  success: boolean
  setAlertMessage: React.Dispatch<
    React.SetStateAction<{
      success: boolean
      showAlert: string
      alertMessage: string
    }>
  >
}
