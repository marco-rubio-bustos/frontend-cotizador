// types
import { CleanSpaces } from '../../types'

export function cleanSpaces({ name }: CleanSpaces): string {
  return name?.split(' ').join('_') ?? ''
}
