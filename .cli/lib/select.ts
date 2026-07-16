import prompts from 'prompts'
import { discover, DiscoveredBlock } from './discovery'
import { missingPrereqs } from './add'

export interface Selection {
  keepBlockSlugs: string[]
  keepCollectionSlugs: string[]
  keepHeroSlugs: string[]
  keepPluginSlugs: string[]
}

export type AddableStatus = 'installed' | 'available' | 'blocked'

export interface AddableBlock {
  block: DiscoveredBlock
  status: AddableStatus
  reason?: string // why it is blocked (missing prereqs), for the picker label
}

/**
 * Classify every template page-builder block against a target project: already installed, available
 * to add, or blocked by missing collections/plugins. Pure sub-blocks (registered via a container's
 * blocks array, not exports.ts) are excluded — they come in automatically as a container's children.
 */
export function addableBlocks(templateRoot: string, targetRoot: string): AddableBlock[] {
  const template = discover(templateRoot)
  const target = discover(targetRoot)
  const installed = new Set(target.blocks.map((b) => b.slug))

  return template.blocks
    .filter((b) => b.registeredIn === 'exports')
    .map((block) => {
      if (installed.has(block.slug)) return { block, status: 'installed' as const }
      const missing = missingPrereqs(block, target)
      if (missing.collections.length || missing.plugins.length) {
        const parts: string[] = []
        if (missing.collections.length) parts.push(`collections: ${missing.collections.join(', ')}`)
        if (missing.plugins.length) parts.push(`plugins: ${missing.plugins.join(', ')}`)
        return { block, status: 'blocked' as const, reason: parts.join('; ') }
      }
      return { block, status: 'available' as const }
    })
}

/**
 * Interactive picker for `add` with no slug: shows installed / available / blocked blocks and returns
 * the slugs the user chose to add. Installed and blocked blocks are shown disabled. Returns null on
 * abort (ctrl-c); returns [] when there is nothing addable.
 */
export async function selectBlocksToAdd(
  templateRoot: string,
  targetRoot: string,
): Promise<string[] | null> {
  const items = addableBlocks(templateRoot, targetRoot)

  const choices = [...items]
    .sort((a, z) => {
      const rank = { available: 0, blocked: 1, installed: 2 } as const
      if (rank[a.status] !== rank[z.status]) return rank[a.status] - rank[z.status]
      return a.block.slug.localeCompare(z.block.slug)
    })
    .map((it) => {
      const group = it.block.override.group ?? 'Other'
      const container = it.block.children.length ? ' (container)' : ''
      const suffix =
        it.status === 'installed'
          ? ' — installed'
          : it.status === 'blocked'
            ? ` — needs ${it.reason}`
            : ''
      return {
        title: `[${group}] ${it.block.slug}${container}${suffix}`,
        value: it.block.slug,
        disabled: it.status !== 'available',
        selected: false,
      }
    })

  const available = items.filter((it) => it.status === 'available')
  if (available.length === 0) {
    console.log('\nNo blocks available to add — everything addable is already installed.')
    const blocked = items.filter((it) => it.status === 'blocked')
    if (blocked.length) {
      console.log('\nBlocked (add the prerequisites first):')
      for (const it of blocked) console.log(`  • ${it.block.slug} — needs ${it.reason}`)
    }
    return []
  }

  const res = await prompts({
    type: 'multiselect',
    name: 'add',
    message: 'Select the blocks to ADD (space to toggle, enter to confirm)',
    choices,
    hint: '- installed / blocked blocks are disabled',
    instructions: false,
  })

  if (!res.add) return null // aborted (ctrl-c)
  return res.add as string[]
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

  // Plugin selection — pruning form-builder/search also removes their injected collections and
  // related blocks (the engine cascades this); redirects is standalone.
  let keepPluginSlugs = d.plugins.map((p) => p.slug)
  if (d.plugins.length) {
    const pluginRes = await prompts({
      type: 'multiselect',
      name: 'keep',
      message: 'Select the Payload PLUGINS to keep (space to toggle)',
      choices: d.plugins.map((p) => ({
        title: p.relatedBlocks.length ? `${p.slug} (also removes: ${p.relatedBlocks.join(', ')})` : p.slug,
        value: p.slug,
        selected: true,
      })),
      instructions: false,
    })
    if (!pluginRes.keep) return null
    keepPluginSlugs = pluginRes.keep as string[]
  }

  return { keepBlockSlugs, keepCollectionSlugs, keepHeroSlugs, keepPluginSlugs }
}
