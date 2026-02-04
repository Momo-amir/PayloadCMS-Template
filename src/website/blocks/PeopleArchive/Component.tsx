import React from 'react'
import type { Person, PeopleArchiveBlock as PeopleArchiveProps } from '@/payload-types'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import RichText from '@/website/components/RichText'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { PersonCard } from '@/website/components/Card/PersonCard'

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
  }
> = async (props) => {
  const { id, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 10

  let people: Person[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const fetchedPeople = await payload.find({
      collection: 'people',
      depth: 1,
      limit,
    })

    people = fetchedPeople.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPeople = selectedDocs
        .map((person) => {
          if (typeof person.value === 'object') return person.value
        })
        .filter(Boolean) as Person[]

      people = filteredSelectedPeople
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      <TrackImpression componentName="People Archive" componentType="people-archive">
        {introContent && (
          <div className="container mb-16">
            <RichText className="ms-0" data={introContent} enableGutter={false} />
          </div>
        )}
        <div className="container">
          <div className={`grid grid-cols-1 ${columnClass(people.length)} gap-6`}>
            {people && people.length > 0 ? (
              people.map((person, index) => {
                if (typeof person === 'object' && person !== null) {
                  return <PersonCard key={index} doc={person} />
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
      </TrackImpression>
    </div>
  )
}
