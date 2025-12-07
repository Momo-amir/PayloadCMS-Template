import type { CollectionAfterReadHook } from 'payload'
import { Person } from '@/payload-types'

export const populateAuthors: CollectionAfterReadHook = async ({ doc, req, req: { payload } }) => {
  if (doc?.authors) {
    const authorDocs: Person[] = []

    for (const author of doc.authors) {
      const authorDoc = await payload.findByID({
        id: typeof author === 'object' ? author?.id : author,
        collection: 'people',
        depth: 0,
        req,
      })

      if (authorDoc) {
        authorDocs.push(authorDoc)
      }
    }

    doc.populatedAuthors = authorDocs.map((authorDoc) => ({
      id: authorDoc.id,
      name: `${authorDoc.firstName} ${authorDoc.lastName}`,
    }))
  }

  return doc
}
