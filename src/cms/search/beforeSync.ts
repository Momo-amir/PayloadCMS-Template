import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

const toSearchableText = (parts: Array<string | null | undefined>) =>
  parts
    .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
    .join(' ')
    .trim()

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const {
    id,
    slug,
    title,
    meta,
    categories,
    firstName,
    lastName,
    email,
    description,
  } = originalDoc

  const isPeopleDoc = collection === 'people'

  const derivedTitle = isPeopleDoc ? toSearchableText([firstName, lastName]) || title : title

  const derivedDescription = isPeopleDoc ? description : meta?.description
  const derivedImage = isPeopleDoc ? originalDoc?.image?.id || originalDoc?.image : meta?.image?.id || meta?.image

  const searchableText = isPeopleDoc
    ? toSearchableText([firstName, lastName, title, email, description, slug])
    : toSearchableText([title, meta?.title, meta?.description, slug])

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    searchableText,
    title: derivedTitle,
    meta: {
      ...meta,
      title: derivedTitle,
      image: derivedImage,
      description: derivedDescription,
    },
    categories: [],
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    const populatedCategories: { id: string | number; title: string }[] = []
    for (const category of categories) {
      if (!category) {
        continue
      }

      if (typeof category === 'object') {
        populatedCategories.push(category)
        continue
      }

      const doc = await req.payload.findByID({
        collection: 'categories',
        id: category,
        disableErrors: true,
        depth: 0,
        select: { title: true },
        req,
      })

      if (doc !== null) {
        populatedCategories.push(doc)
      } else {
        console.error(
          `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
        )
      }
    }

    modifiedDoc.categories = populatedCategories.map((each) => ({
      relationTo: 'categories',
      categoryID: String(each.id),
      title: each.title,
    }))
  }

  return modifiedDoc
}
