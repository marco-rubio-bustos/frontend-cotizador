import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getQuotation } from '../../api/apiConnection'
import { Spinner } from 'react-bootstrap'
//types
import { Current } from '../../types/current'
import { UpdateCurrentNumber } from '../../types/updateCurrentNumber'

const CurrentNumberQuotation: React.FC<UpdateCurrentNumber> = ({
  onUpdateCurrentNumber,
}) => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null)

  const { data: quotationData, isSuccess } = useQuery<Current>({
    queryKey: ['quotation'],
    queryFn: () => getQuotation({ page: 1, pageSize: 2, onPageChange: () => {} }),
    refetchInterval: 1000,
  })

  useEffect(() => {
    if (isSuccess && quotationData && quotationData.lastId !== undefined) {
      if (currentNumber !== quotationData.lastId) {
        const customerData = {
          number: currentNumber ?? 0, // Valor por defecto
          lastId: quotationData.lastId,
        }

        // Actualizamos el estado y notificamos al componente padre
        setCurrentNumber(quotationData.lastId)
        onUpdateCurrentNumber(customerData)
      }
    }
  }, [quotationData, isSuccess])

  return (
    <h2 className="m-0 pe-5">
      N°{' '}
      {currentNumber !== null ? (
        currentNumber + 1
      ) : (
        <Spinner animation="grow" variant="warning" />
      )}
    </h2>
  )
}

export default CurrentNumberQuotation
