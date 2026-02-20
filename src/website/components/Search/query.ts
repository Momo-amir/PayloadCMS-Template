import type { Payload, TypedLocale, Where } from 'payload'
import type { Person, Search } from '@/payload-types'
import type { CardPostData } from '@/website/components/Card/PostCard'

export type SearchCollection = 'posts' | 'people'

export type SearchQueryArgs = {
  payload: Payload
  locale: TypedLocale
  query?: string | null
  limit: number
  page?: number
  collection: SearchCollection
  categoryIDs?: string[]
}

type SearchResultBuckets = {
  totalDocs: number
  totalPages: number
  currentPage: number
  postDocs: CardPostData[]
  peopleDocs: Person[]
}

export const querySearchResults = async (args: SearchQueryArgs): Promise<SearchResultBuckets> => {
  const { payload, locale, query, limit, page = 1, collection, categoryIDs = [] } = args

  const filters: Where[] = []

  if (query) {
    filters.push({
      or: [
        {
          searchableText: {
            like: query,
          },
        },
        {
          title: {
            like: query,
          },
        },
        {
          'meta.title': {
            like: query,
          },
        },
        {
          'meta.description': {
            like: query,
          },
        },
        {
          slug: {
            like: query,
          },
        },
      ],
    })
  }

  const where = filters.length === 1 ? filters[0] : { and: filters }

  const batchSize = Math.min(Math.max(limit * 20, 200), 1000)
  let batchPage = 1
  let hasNextPage = true
  const docs: Search[] = []

  while (hasNextPage) {
    const batch = await payload.find({
      collection: 'search',
      locale,
      fallbackLocale: 'da',
      depth: 1,
      limit: batchSize,
      page: batchPage,
      pagination: true,
      ...(filters.length > 0 ? { where } : {}),
    })

    docs.push(...(batch.docs as Search[]))
    hasNextPage = Boolean(batch.hasNextPage)
    batchPage += 1

    // Safety guard for pathological datasets.
    if (batchPage > 200) {
      break
    }
  }

  const postDocs: CardPostData[] = []
  const peopleDocs: Person[] = []
  const unresolvedPeopleIDs: Array<number | string> = []
  const categoryIDSet = new Set(categoryIDs)

  docs.forEach((doc) => {
    if (doc.doc.relationTo !== collection) {
      return
    }

    if (doc.doc.relationTo === 'posts') {
      if (categoryIDSet.size > 0) {
        const hasCategory =
          Array.isArray(doc.categories) &&
          doc.categories.some((category) => {
            const id = category?.categoryID
            return typeof id === 'string' && categoryIDSet.has(id)
          })

        if (!hasCategory) {
          return
        }
      }

      if (typeof doc.doc.value === 'object') {
        postDocs.push(doc.doc.value as CardPostData)
        return
      }

      // Fallback when relation is not depth-populated: render from indexed search fields.
      postDocs.push({
        title: doc.title ?? '',
        slug: doc.slug ?? '',
        categories: doc.categories as CardPostData['categories'],
        meta: doc.meta as CardPostData['meta'],
      })
      return
    }

    if (doc.doc.relationTo === 'people') {
      if (typeof doc.doc.value === 'object') {
        peopleDocs.push(doc.doc.value as Person)
      } else {
        unresolvedPeopleIDs.push(doc.doc.value)
      }
    }
  })

  if (unresolvedPeopleIDs.length > 0) {
    const unresolvedPeople = await payload.find({
      collection: 'people',
      locale,
      depth: 1,
      pagination: false,
      where: {
        id: {
          in: unresolvedPeopleIDs,
        },
      },
    })

    const peopleByID = new Map<number | string, Person>()
    unresolvedPeople.docs.forEach((person) => {
      peopleByID.set(person.id, person as Person)
    })

    unresolvedPeopleIDs.forEach((id) => {
      const person = peopleByID.get(id)
      if (person) {
        peopleDocs.push(person)
      }
    })
  }

  const sourceDocs = collection === 'posts' ? postDocs : peopleDocs
  const totalDocs = sourceDocs.length
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const start = (currentPage - 1) * limit
  const end = start + limit
  const pagedDocs = sourceDocs.slice(start, end)

  return {
    totalDocs,
    totalPages,
    currentPage,
    postDocs: collection === 'posts' ? (pagedDocs as CardPostData[]) : [],
    peopleDocs: collection === 'people' ? (pagedDocs as Person[]) : [],
  }
}
