export interface CustomModalMessage {
  modalState: { show: boolean; index: number }
  onHide: (data: number) => void
}
