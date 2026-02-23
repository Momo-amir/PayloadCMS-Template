'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/website/components/elements/pagination'
import { cn } from '@/cms/utilities/ui'

type ArchivePaginationProps = {
  currentPage: number
  totalPages: number
  basePath?: string
  className?: string
  scrollTargetId?: string
  pageParamKey?: string
}

export const ArchivePagination: React.FC<ArchivePaginationProps> = ({
  currentPage,
  totalPages,
  basePath = '',
  className,
  scrollTargetId,
  pageParamKey = 'page',
}) => {
  const router = useRouter()

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
    if (page < 1 || page > totalPages || page === currentPage) return

    const params = new URLSearchParams(window.location.search)

    if (page > 1) {
      params.set(pageParamKey, String(page))
    } else {
      params.delete(pageParamKey)
    }

    const qs = params.toString()
    const path = qs
      ? `${basePath || window.location.pathname}?${qs}`
      : basePath || window.location.pathname
    const url = scrollTargetId ? `${path}#${scrollTargetId}` : path

    if (scrollTargetId) {
      router.push(url)
      return
    }

    router.push(url, { scroll: false })
  }

  if (totalPages <= 1) return null

  return (
    <div className={cn('my-12', className)}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={currentPage <= 1}
              onClick={() => navigate(currentPage - 1)}
            />
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
                  <PaginationLink
                    isActive={pageNumber === currentPage}
                    onClick={() => navigate(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              </React.Fragment>
            )
          })}

          <PaginationItem>
            <PaginationNext
              disabled={currentPage >= totalPages}
              onClick={() => navigate(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
