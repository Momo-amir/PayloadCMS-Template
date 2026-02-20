'use client'

import React, { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/website/components/elements/pagination'

type SearchPaginationControlsProps = {
  currentPage: number
  totalPages: number
  searchPath: string
  query?: string
}

export const SearchPaginationControls: React.FC<SearchPaginationControlsProps> = ({
  currentPage,
  totalPages,
  searchPath,
  query,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const visiblePages = useMemo(() => {
    const pages = new Set<number>()
    pages.add(1)
    pages.add(totalPages)

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i >= 1 && i <= totalPages) {
        pages.add(i)
      }
    }

    return Array.from(pages).sort((a, b) => a - b)
  }, [currentPage, totalPages])

  const navigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    const normalizedQuery = query?.trim()

    if (normalizedQuery) {
      params.set('q', normalizedQuery)
    } else {
      params.delete('q')
    }

    if (page > 1) {
      params.set('page', String(page))
    } else {
      params.delete('page')
    }

    const qs = params.toString()
    router.push(qs ? `${searchPath}?${qs}` : searchPath, { scroll: false })
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled={currentPage <= 1} onClick={() => navigate(currentPage - 1)} />
        </PaginationItem>

        {visiblePages.map((pageNumber, index) => {
          const previousPage = visiblePages[index - 1]
          const shouldShowEllipsis = previousPage && pageNumber - previousPage > 1

          return (
            <React.Fragment key={pageNumber}>
              {shouldShowEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink isActive={pageNumber === currentPage} onClick={() => navigate(pageNumber)}>
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            </React.Fragment>
          )
        })}

        <PaginationItem>
          <PaginationNext disabled={currentPage >= totalPages} onClick={() => navigate(currentPage + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
