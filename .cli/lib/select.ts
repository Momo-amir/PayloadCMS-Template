import prompts from 'prompts'
import { discover } from './discovery'

export interface Selection {
  keepBlockSlugs: string[]
  keepCollectionSlugs: string[]
  keepHeroSlugs: string[]
}

/**
 * Interactive block selection. Groups blocks by override.group; container children are shown as
 * selectable too so the user can slim a container. Returns the slugs to KEEP.
 */
export async function selectFeatures(root: string): Promise<Selection | null> {
  const d = discover(root)

  const groups = new Map<string, typeof d.blocks>()
  for (const b of d.blocks) {
    const g = b.override.group ?? 'Other'
    if (!groups.has(g)) groups.set(g, [])
    groups.get(g)!.push(b)
  }

  const choices = [...groups]
    .sort()
    .flatMap(([group, blocks]) =>
      blocks
        .sort((a, z) => a.slug.localeCompare(z.slug))
        .map((b) => {
          const tags = [
            b.children.length ? `container` : null,
            b.showOnPage ? null : 'sub-block',
            b.override.requiresCollections?.length ? `needs ${b.override.requiresCollections.join('+')}` : null,
          ].filter(Boolean)
          return {
            title: `[${group}] ${b.slug}${tags.length ? ` (${tags.join(', ')})` : ''}`,
            value: b.slug,
            selected: true,
          }
        }),
    )

  const res = await prompts({
    type: 'multiselect',
    name: 'keep',
    message: 'Select the blocks to KEEP (space to toggle, enter to confirm)',
    choices,
    hint: '- all selected by default; deselect what you do not want',
    instructions: false,
  })

  if (!res.keep) return null // user aborted (ctrl-c)
  const keepBlockSlugs = res.keep as string[]

  // Collection selection — core collections are locked (always kept), optional ones are selectable.
  const optional = d.collections.filter((c) => !c.core)
  const coreSlugs = d.collections.filter((c) => c.core).map((c) => c.slug)
  let keepCollectionSlugs = [...coreSlugs, ...optional.map((c) => c.slug)]

  if (optional.length) {
    const collRes = await prompts({
      type: 'multiselect',
      name: 'keep',
      message: `Select OPTIONAL collections to KEEP (core kept automatically: ${coreSlugs.join(', ')})`,
      choices: optional.map((c) => ({ title: c.slug, value: c.slug, selected: true })),
      instructions: false,
    })
    if (!collRes.keep) return null
    keepCollectionSlugs = [...coreSlugs, ...(collRes.keep as string[])]

    // Conflict confirm: pruning a collection that a kept block requires. A block whose ENTIRE
    // requiresCollections set is pruned is auto-pruned by the engine, so it is NOT a dangling
    // conflict — only warn when at least one required collection survives (a genuine dangle).
    const keptColl = new Set(keepCollectionSlugs)
    const keptBlockSet = new Set(keepBlockSlugs)
    const conflicts: string[] = []
    for (const b of d.blocks) {
      if (!keptBlockSet.has(b.slug)) continue
      const reqs = b.override.requiresCollections ?? []
      if (reqs.length > 0 && reqs.every((need) => !keptColl.has(need))) continue
      for (const need of reqs) {
        if (!keptColl.has(need)) conflicts.push(`${b.slug} → ${need}`)
      }
    }
    if (conflicts.length) {
      const confirm = await prompts({
        type: 'confirm',
        name: 'ok',
        message:
          `These kept blocks reference a pruned collection (their relationTo will dangle; you'll rewire manually):\n` +
          conflicts.map((c) => `    • ${c}`).join('\n') +
          `\nProceed anyway?`,
        initial: false,
      })
      if (!confirm.ok) return null
    }
  }

  // Hero selection — presentational heros only ('none' and the search hero are always available).
  let keepHeroSlugs = d.heros.map((h) => h.slug)
  if (d.heros.length) {
    const heroRes = await prompts({
      type: 'multiselect',
      name: 'keep',
      message: 'Select the page HEROS to keep (space to toggle)',
      choices: d.heros.map((h) => ({ title: h.slug, value: h.slug, selected: true })),
      hint: '- “None” is always available; the search hero follows the search plugin',
      instructions: false,
    })
    if (!heroRes.keep) return null
    keepHeroSlugs = heroRes.keep as string[]
  }

  return { keepBlockSlugs, keepCollectionSlugs, keepHeroSlugs }
}
