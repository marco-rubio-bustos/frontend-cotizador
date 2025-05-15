import { Pagination } from 'react-bootstrap'
// types
import { PaginationParams } from '../../types/paginationParams'

const PaginationBasic: React.FC<PaginationParams> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  showPagination,
}) => {
  if (!showPagination) {
    return null // Ocultar el paginador si showPagination es false
  }
  const totalPages = Math.ceil((totalItems ?? 0) / (pageSize ?? 0))

  let items = []
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => onPageChange(number)}
      >
        {number}
      </Pagination.Item>,
    )
  }

  return (
    <Pagination className="justify-content-center mt-5" size="sm">
      {items}
    </Pagination>
  )
}

export default PaginationBasic
