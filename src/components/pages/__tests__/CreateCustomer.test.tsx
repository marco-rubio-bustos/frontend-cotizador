import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CreateCustomer from '../CreateCustomer'

const queryClient = new QueryClient()

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <CreateCustomer />
    </QueryClientProvider>,
  )

describe('CreateCustomer', () => {
  test('renderiza todos los campos del formulario', () => {
    renderComponent()

    expect(screen.getByLabelText(/Cliente/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Rut/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Dirección/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Atención/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Notas Generales/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /crear cliente/i }),
    ).toBeInTheDocument()
  })

  test('permite escribir en el campo Cliente', () => {
    renderComponent()
    const input = screen.getByLabelText(/Cliente/i)
    fireEvent.change(input, { target: { value: 'Juan Pérez' } })
    expect(input).toHaveValue('Juan Pérez')
  })
})
