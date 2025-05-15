import { Current } from '../types/current'

export interface UpdateCurrentNumber {
  onUpdateCurrentNumber: (current: Current | null) => void
}
