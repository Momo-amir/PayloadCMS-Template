/**
 * Extracts and validates the page number from URL search parameters
 * @param searchParams - Next.js searchParams object from server components
 * @returns Valid page number (minimum 1)
 */
export function getPageFromSearchParams(
  searchParams?: {
    [key: string]: string | string[] | undefined
  },
  pageParamKey = 'page',
): number {
  const rawPage = searchParams?.[pageParamKey]
  const pageParam = Array.isArray(rawPage) ? rawPage[0] : rawPage
  const requestedPageRaw = Number.parseInt(pageParam || '1', 10)
  return Number.isFinite(requestedPageRaw) && requestedPageRaw > 0 ? requestedPageRaw : 1
}

const sanitizeParamToken = (value?: string): string | null => {
  if (!value) return null
  const cleaned = value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
  return cleaned.length > 0 ? cleaned : null
}

export function getPaginationScopeIds(
  scope: 'archive' | 'people',
  blockId?: string,
): { pageParamKey: string; anchorId: string } {
  const token = sanitizeParamToken(blockId)

  if (!token) {
    return {
      pageParamKey: `${scope}Page`,
      anchorId: scope,
    }
  }

  return {
    pageParamKey: `${scope}Page_${token}`,
    anchorId: `${scope}-${token}`,
  }
}

/**
 * Type for pagination props to standardize archive components
 */
export type PaginationProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
}

/**
 * Type for pagination result from Payload queries
 */
export type PaginationResult = {
  currentPage: number
  totalPages: number
  shouldShow: boolean
}

/**
 * Extracts pagination data from a Payload query result
 * @param result - Payload query result with pagination info (null when not using collection)
 * @param enablePagination - Whether pagination is enabled in the CMS (handles null from Payload)
 * @param populateBy - How the archive is populated ('collection' or 'selection', handles null from Payload)
 * @returns Pagination data including shouldShow flag
 *
 * @example
 * ```tsx
 * const pagination = getPaginationData(result, enablePagination, populateBy)
 * if (pagination.shouldShow) {
 *   <ArchivePagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
 * }
 * ```
 */
export function getPaginationData(
  result: { page?: number; totalPages: number } | null,
  enablePagination?: boolean | null,
  populateBy?: string | null,
): PaginationResult {
  // Handle null result (when populateBy !== 'collection')
  if (!result) {
    return {
      currentPage: 1,
      totalPages: 1,
      shouldShow: false,
    }
  }

  const currentPage = result.page || 1
  const totalPages = result.totalPages
  const shouldShow = enablePagination === true && populateBy === 'collection' && totalPages > 1

  return {
    currentPage,
    totalPages,
    shouldShow,
  }
}
