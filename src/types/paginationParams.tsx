export interface PaginationParams {
  page?: number
  pageSize?: number
  all?: boolean
  currentPage?: number
  totalItems?: number
  onPageChange: (page: number) => void
  showPagination?: boolean
}
