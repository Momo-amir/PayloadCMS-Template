import React from 'react'
import type { Person, PeopleArchiveBlock as PeopleArchiveProps } from '@/payload-types'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import RichText from '@/website/components/RichText'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { PersonCard } from '@/website/components/Card/PersonCard'
import { ArchivePagination } from '@/website/components/ArchivePagination'
import { STAGGER_GRID_CLASS, getStaggerItemProps } from '@/website/utilities/stagger'
import {
  getPageFromSearchParams,
  getPaginationData,
  getPaginationScopeIds,
  type PaginationProps,
} from '@/website/utilities/pagination'

const columnClass = (cardCount: number) => {
  switch (cardCount) {
    case 1:
      return 'md:grid-cols-1'
    case 2:
      return 'md:grid-cols-2'
    case 3:
    default:
      return 'md:grid-cols-2 lg:grid-cols-3' // 3+ cards always use 3 columns
  }
}

export const PeopleArchive: React.FC<
  PeopleArchiveProps & {
    id?: string
  } & PaginationProps
> = async (props) => {
  const {
    id,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    enablePagination,
    searchParams,
  } = props

  const limit = limitFromProps || 10
  const { pageParamKey, anchorId } = getPaginationScopeIds('people', id)
  const requestedPage = getPageFromSearchParams(searchParams, pageParamKey)

  let people: Person[] = []
  let result = null

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    result = await payload.find({
      collection: 'people',
      depth: 1,
      limit,
      page: enablePagination ? requestedPage : undefined,
      sort: 'firstName',
    })

    people = result.docs
  } else if (populateBy === 'selection' && selectedDocs?.length) {
    const resolved = selectedDocs.map((doc) => doc.value)
    const alreadyResolved = resolved.filter((v): v is Person => typeof v === 'object')
    const unresolvedIds = resolved.filter((v): v is number => typeof v === 'number')

    if (unresolvedIds.length > 0) {
      const payload = await getPayload({ config: configPromise })
      const fetched = await payload.find({
        collection: 'people',
        depth: 1,
        limit: unresolvedIds.length,
        where: { id: { in: unresolvedIds } },
      })
      people = [...alreadyResolved, ...fetched.docs]
    } else {
      people = alreadyResolved
    }
  }

  const pagination = getPaginationData(result, enablePagination, populateBy)

  return (
    <div className="my-16" id={anchorId} data-block-id={id ? `block-${id}` : undefined}>
      <TrackImpression componentName="People Archive" componentType="people-archive">
        {introContent && (
          <div className="container mb-16">
            <RichText className="ms-0" data={introContent} enableGutter={false} />
          </div>
        )}
        <div className="container">
          <div
            key={pagination.currentPage}
            className={`grid grid-cols-1 ${columnClass(people.length)} gap-6 ${STAGGER_GRID_CLASS}`}
          >
            {people && people.length > 0 ? (
              people.map((person, index) => {
                if (typeof person === 'object' && person !== null) {
                  return (
                    <div key={person.id} {...getStaggerItemProps(index)}>
                      <PersonCard doc={person} />
                    </div>
                  )
                }
                return null
              })
            ) : (
              <div className="col-span-full">
                <p className="text-center text-muted-foreground">No people found.</p>
              </div>
            )}
          </div>
        </div>
        {pagination.shouldShow && (
          <div className="container">
            <ArchivePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              scrollTargetId={anchorId}
              pageParamKey={pageParamKey}
            />
          </div>
        )}
      </TrackImpression>
    </div>
  )
}
