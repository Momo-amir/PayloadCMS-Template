import Path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
import { Project } from 'ts-morph'
import { discover, DiscoveredBlock } from './discovery'
import { fileClosure } from './closure'
import {
  applyRemovals,
  applyStringRemovals,
  applyValueRemovals,
  applyFieldRelationRemovals,
  applyObjectPropertyRemovals,
  removeCallExpressionMember,
  removeImportByModuleContains,
  removeObjectPropertyByName,
} from './codemod'

// Inline blocks the RichText hub (src/website/components/RichText/index.tsx) hardcodes a component
// import + converter-map entry for. When one is pruned, both must be cleaned or the build fails on a
// dangling import of the deleted folder. Keyed by block slug → { folder, converter-map key }.
const RICHTEXT_INLINE_BLOCKS: Record<string, { folder: string; converterKey: string }> = {
  mediaBlock: { folder: 'Media', converterKey: 'mediaBlock' },
  codeBlock: { folder: 'Code', converterKey: 'code' },
  columnsBlock: { folder: 'Columns', converterKey: 'columns' },
  bannerBlock: { folder: 'Banner', converterKey: 'banner' },
  callToActionBlock: { folder: 'CallToAction', converterKey: 'cta' },
}

export interface GenerateOptions {
  root: string
  outDir: string
  keepBlockSlugs: string[] // slugs the user chose to KEEP
  keepCollectionSlugs?: string[] // optional-collection slugs to KEEP; undefined = keep all
  keepHeroSlugs?: string[] // presentational hero slugs to KEEP; undefined = keep all
  keepPluginSlugs?: string[] // selectable plugin slugs to KEEP; undefined = keep all
  dryRun: boolean
}

export interface HeroPrune {
  slug: string
  folder: string // repo-relative folder to remove
  symbol: string // RenderHero import/map symbol
}

export interface PluginPrune {
  slug: string
  callee: string // plugin fn to remove from the plugins array (+ import)
  pkg: string // package.json dep to drop
  helperImports: string[] // config-only imports to drop
  injectsCollections: string[] // collection slugs that vanish with the plugin
  ownedFiles: string[] // repo-relative plugin-config files to delete
  relatedBlocks: string[] // blocks that become meaningless (warned)
}

export interface ContainerChildEdit {
  containerConfig: string // repo-relative container config.ts
  removeSymbols: string[] // child export-const symbols to remove from the container's blocks arrays
  removeChildSlugs: string[]
}

export interface CollectionPrune {
  slug: string
  symbol: string
  folderOrFile: string // repo-relative path to remove
  configImportRemoval: string // symbol to remove from payload.config.ts collections + import
  stringListEdits: { file: string; value: string }[] // plugin/search collections: ['x'] removals
  ownedFiles: string[] // collection-owned app files/routes to delete
  patches: { file: string; find: string; replace: string }[] // shared-file find/replace edits
  conflicts: string[] // kept block slugs that require this collection (needs confirm)
}

export interface RelationTrimEdit {
  blockConfig: string // repo-relative block config to trim
  removeCollectionSlugs: string[]
}

export interface GeneratePlan {
  keptBlocks: string[]
  prunedBlocks: string[]
  prunedFolders: string[] // repo-relative
  registrationEdits: { file: string; symbols: string[] }[]
  containerChildEdits: ContainerChildEdit[]
  prunedCollections: CollectionPrune[]
  relationTrimEdits: RelationTrimEdit[]
  prunedHeros: HeroPrune[]
  prunedPlugins: PluginPrune[]
  warnings: string[]
}

/**
 * Resolve which blocks survive: a block is kept if selected, OR it is a dependency of a kept block
 * (import-closure handles this at the file level), OR it is a required sub-block. Prerequisites on
 * collections/plugins are surfaced as warnings for the caller to act on.
 */
function planPrune(
  root: string,
  keepSlugs: Set<string>,
  keepCollectionSlugs?: string[],
  keepHeroSlugs?: string[],
  keepPluginSlugs?: string[],
): GeneratePlan {
  const d = discover(root)
  const warnings: string[] = []

  // Plugins: prune any selectable plugin not in the keep list (undefined = keep all). A pruned
  // plugin also removes its injected collections and its related blocks (via forcePrune below).
  const prunedPlugins: PluginPrune[] = []
  const pluginForcePruneBlocks = new Set<string>()
  const pluginPrunedCollSlugs = new Set<string>()
  if (keepPluginSlugs) {
    const keep = new Set(keepPluginSlugs)
    for (const p of d.plugins) {
      if (keep.has(p.slug)) continue
      prunedPlugins.push({
        slug: p.slug,
        callee: p.callee,
        pkg: p.pkg,
        helperImports: p.helperImports,
        injectsCollections: p.injectsCollections,
        ownedFiles: p.ownedFiles,
        relatedBlocks: p.relatedBlocks,
      })
      p.relatedBlocks.forEach((b) => pluginForcePruneBlocks.add(b))
      p.injectsCollections.forEach((c) => pluginPrunedCollSlugs.add(c))
    }
  }

  // Heros: prune any presentational hero not in the keep list (undefined = keep all).
  const prunedHeros: HeroPrune[] = []
  if (keepHeroSlugs) {
    const keep = new Set(keepHeroSlugs)
    for (const h of d.heros) {
      if (!keep.has(h.slug)) {
        prunedHeros.push({
          slug: h.slug,
          folder: Path.relative(root, Path.resolve(root, 'src/website/layout/heros', h.folder)),
          symbol: h.symbol,
        })
      }
    }
  }

  // onlyInside sub-blocks survive iff their parent survives.
  for (const b of d.blocks) {
    if (b.override.onlyInside && keepSlugs.has(b.override.onlyInside)) keepSlugs.add(b.slug)
  }

  const bySlug = new Map(d.blocks.map((b) => [b.slug, b]))

  // Collections the caller chose to prune (undefined keepCollectionSlugs = keep all). Computed up
  // front so a block whose required collections are ALL pruned can itself be pruned below.
  const willPruneCollSlugs = new Set<string>()
  if (keepCollectionSlugs) {
    const keepColl = new Set(keepCollectionSlugs)
    for (const coll of d.collections) {
      if (!coll.core && !keepColl.has(coll.slug)) willPruneCollSlugs.add(coll.slug)
    }
  }

  // A collection is pruned if the caller deselected it OR the plugin that injects it was pruned.
  const allPrunedCollSlugs = new Set([...willPruneCollSlugs, ...pluginPrunedCollSlugs])

  // A block whose ENTIRE requiresCollections set is being pruned is meaningless on its own (e.g.
  // peopleArchiveBlock without the people collection) — prune it too. A block that still has at
  // least one required collection surviving is kept and its dangling relationTo is trimmed below.
  // Blocks tied to a pruned plugin (e.g. formBlock ↔ form-builder) are force-pruned regardless.
  const forcePrune = new Set<string>(pluginForcePruneBlocks)
  for (const slug of pluginForcePruneBlocks) keepSlugs.delete(slug)
  for (const b of d.blocks) {
    const reqs = b.override.requiresCollections ?? []
    if (reqs.length > 0 && reqs.every((s) => allPrunedCollSlugs.has(s))) {
      keepSlugs.delete(b.slug)
      forcePrune.add(b.slug)
    }
  }

  // Survival graph: a block survives if selected OR pulled in by a surviving block through a
  // NON-container dependency. Container→child edges are prunable (deselecting a child removes it
  // from the container), so they do NOT force survival.
  const survives = new Set(keepSlugs)
  // Sub-blocks (onlyInside) survive iff their parent survives AND they are selected — otherwise the
  // container-child rule prunes them. We treat them like any other child below.
  const containerChildSlugs = new Set(d.blocks.flatMap((b) => b.children.map((c) => c.slug)))

  // Non-container survival closure via the file import graph, but excluding container child folders
  // that were not selected. We seed from surviving block configs and walk imports; any block folder
  // reached that is a container-child-only and unselected is later pruned from the container instead.
  const blocksDir = Path.resolve(root, 'src/website/blocks')
  const closure = fileClosure(
    root,
    [...survives].map((s) => Path.resolve(root, bySlug.get(s)!.configPath)),
  )
  for (const f of closure) {
    if (f.startsWith(blocksDir + Path.sep)) {
      const folder = Path.relative(blocksDir, f).split(Path.sep)[0]
      const blk = d.blocks.find((b) => b.folder === folder)
      // A block reached purely as a container child (and not selected) must NOT auto-survive.
      if (blk && !survives.has(blk.slug) && containerChildSlugs.has(blk.slug)) continue
      // A block force-pruned because all its required collections are gone must not be revived.
      if (blk && forcePrune.has(blk.slug)) continue
      if (blk) survives.add(blk.slug)
    }
  }

  const kept = d.blocks.filter((b) => survives.has(b.slug))
  const pruned = d.blocks.filter((b) => !survives.has(b.slug))

  // Prerequisite warnings for kept blocks.
  const keptCollectionSlugs = new Set([...d.collections.map((c) => c.slug), ...d.pluginCollections])
  for (const b of kept) {
    for (const need of b.override.requiresCollections ?? []) {
      if (!keptCollectionSlugs.has(need)) {
        warnings.push(`Block "${b.slug}" needs collection "${need}" — ensure it stays registered.`)
      }
    }
    for (const plugin of b.override.requiresPlugins ?? []) {
      warnings.push(`Block "${b.slug}" needs plugin "${plugin}" — keep it in package.json + plugins.`)
    }
  }

  // Container child edits: for each KEPT container, remove children that did not survive.
  const containerChildEdits: ContainerChildEdit[] = []
  for (const c of kept) {
    if (c.children.length === 0) continue
    const removeChildren = c.children.filter((ch) => !survives.has(ch.slug))
    if (removeChildren.length === 0) continue
    containerChildEdits.push({
      containerConfig: c.configPath,
      removeSymbols: removeChildren.map((ch) => ch.symbol),
      removeChildSlugs: removeChildren.map((ch) => ch.slug),
    })
    if (removeChildren.length === c.children.length) {
      warnings.push(`Container "${c.slug}" kept with an empty blocks list — add project-specific children.`)
    }
  }

  // Registration edits: remove each pruned block's export symbol from exports.ts / BlocksFeature files.
  const editsByFile = new Map<string, Set<string>>()
  const addEdit = (absFile: string, symbol: string) => {
    if (!editsByFile.has(absFile)) editsByFile.set(absFile, new Set())
    editsByFile.get(absFile)!.add(symbol)
  }
  const exportsFile = Path.resolve(root, 'src/website/blocks/exports.ts')
  const postsFile = Path.resolve(root, 'src/cms/collections/Posts/index.ts')
  for (const b of pruned) {
    if (b.registeredIn === 'exports') addEdit(exportsFile, b.exportConst)
    else addEdit(postsFile, b.exportConst)
  }

  // Collection prune: only OPTIONAL (non-core) collections may be pruned. undefined keepCollections
  // means keep everything.
  const prunedCollections: CollectionPrune[] = []
  if (keepCollectionSlugs) {
    const keepColl = new Set(keepCollectionSlugs)
    const stringListFiles = [
      'src/cms/plugins/index.ts',
      'src/cms/search/beforeSync.ts',
      'src/website/layout/search/beforeSync.ts',
      'src/website/layout/heros/config.ts',
    ].map((p) => Path.resolve(root, p))

    for (const coll of d.collections) {
      if (coll.core || keepColl.has(coll.slug)) continue
      // conflicts: kept blocks that require this collection.
      const conflicts = kept
        .filter((b) => (b.override.requiresCollections ?? []).includes(coll.slug))
        .map((b) => b.slug)

      const folderOrFile = collectionPath(root, coll.importPath)
      const stringListEdits = stringListFiles
        .filter((f) => fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes(`'${coll.slug}'`))
        .map((f) => ({ file: Path.relative(root, f), value: coll.slug }))

      prunedCollections.push({
        slug: coll.slug,
        symbol: coll.symbol,
        folderOrFile: folderOrFile ? Path.relative(root, folderOrFile) : '',
        configImportRemoval: coll.symbol,
        stringListEdits,
        ownedFiles: coll.ownedFiles,
        patches: coll.patches,
        conflicts,
      })
      if (conflicts.length) {
        warnings.push(
          `Collection "${coll.slug}" is required by kept block(s): ${conflicts.join(', ')}. ` +
            `Their relationTo will dangle — rewire manually.`,
        )
      }
    }
  }

  // Plugin prune warnings: the search hero is not auto-removed with the search plugin (it is part of
  // the hero dimension), so flag it if search was pruned while a search hero could still be selected.
  for (const p of prunedPlugins) {
    if (p.slug === 'search') {
      warnings.push(
        `Plugin "search" pruned — the "Search Hero" option and website search UI (SearchHero, ` +
          `components/Search) still reference it. Remove those manually if unused.`,
      )
    }
    if (p.relatedBlocks.length) {
      warnings.push(`Plugin "${p.slug}" pruned — related block(s) removed: ${p.relatedBlocks.join(', ')}.`)
    }
  }

  // relationTo trims: for each KEPT block that requires a PRUNED collection, trim that collection
  // from the block's config-driven list so it still compiles (block stays, collection gone).
  const prunedCollSlugs = new Set(prunedCollections.map((c) => c.slug))
  const relationTrimEdits: RelationTrimEdit[] = []
  for (const b of kept) {
    const trims = (b.override.requiresCollections ?? []).filter((s) => prunedCollSlugs.has(s))
    if (trims.length) relationTrimEdits.push({ blockConfig: b.configPath, removeCollectionSlugs: trims })
  }

  return {
    keptBlocks: kept.map((b) => b.slug),
    prunedBlocks: pruned.map((b) => b.slug),
    prunedFolders: pruned.map((b) => Path.relative(root, Path.join(blocksDir, b.folder))),
    registrationEdits: [...editsByFile].map(([file, symbols]) => ({
      file: Path.relative(root, file),
      symbols: [...symbols],
    })),
    containerChildEdits,
    prunedCollections,
    relationTrimEdits,
    prunedHeros,
    prunedPlugins,
    warnings,
  }
}

/** Resolve a collection's source path (folder with index.ts, or a single .ts file) from its import. */
function collectionPath(root: string, importPath: string): string | null {
  if (!importPath) return null
  const base = importPath.startsWith('./')
    ? Path.resolve(root, 'src', importPath.slice(2))
    : Path.resolve(root, 'src', importPath.replace(/^\.\//, ''))
  const candidates = [`${base}.ts`, Path.join(base, 'index.ts'), base]
  const hit = candidates.find((c) => fs.existsSync(c))
  if (!hit) return null
  // If it's an index.ts inside a dedicated folder, remove the whole folder.
  if (hit.endsWith(`${Path.sep}index.ts`)) return Path.dirname(hit)
  return hit
}

function copyTree(root: string, outDir: string) {
  fs.mkdirSync(outDir, { recursive: true })
  // Use git to copy only tracked + untracked-but-not-ignored files.
  const files = execSync('git ls-files --cached --others --exclude-standard', {
    cwd: root,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean)
  for (const rel of files) {
    const src = Path.join(root, rel)
    const dest = Path.join(outDir, rel)
    if (!fs.existsSync(src)) continue
    fs.mkdirSync(Path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
  }
}

export function generate(opts: GenerateOptions): GeneratePlan {
  const keepSlugs = new Set(opts.keepBlockSlugs)
  const plan = planPrune(
    opts.root,
    keepSlugs,
    opts.keepCollectionSlugs,
    opts.keepHeroSlugs,
    opts.keepPluginSlugs,
  )

  if (opts.dryRun) return plan

  // 1. Copy the template into the output dir.
  copyTree(opts.root, opts.outDir)

  // 2. Physically remove pruned block folders in the OUTPUT.
  for (const rel of plan.prunedFolders) {
    fs.rmSync(Path.join(opts.outDir, rel), { recursive: true, force: true })
  }

  // 3. Apply registration removals to the OUTPUT copy via ts-morph.
  const outProject = new Project({
    tsConfigFilePath: Path.resolve(opts.outDir, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  })
  applyRemovals(
    outProject,
    plan.registrationEdits.map((e) => ({
      absPath: Path.resolve(opts.outDir, e.file),
      symbols: e.symbols,
    })),
  )

  // 3b. Clean the RichText hub for pruned inline blocks. RichText/index.tsx hardcodes component
  //     imports + a converter map for banner/media/code/cta/columns; a pruned one leaves a dangling
  //     import of a deleted folder (build break). Remove that block's component import + map entry.
  const richTextFile = Path.resolve(opts.outDir, 'src/website/components/RichText/index.tsx')
  const rtSf = fs.existsSync(richTextFile) ? outProject.addSourceFileAtPathIfExists(richTextFile) : null
  if (rtSf) {
    let rtChanged = false
    for (const slug of plan.prunedBlocks) {
      const rt = RICHTEXT_INLINE_BLOCKS[slug]
      if (!rt) continue
      if (removeImportByModuleContains(rtSf, `blocks/${rt.folder}/Component`)) rtChanged = true
      if (removeObjectPropertyByName(rtSf, rt.converterKey)) rtChanged = true
    }
    if (rtChanged) rtSf.saveSync()
  }

  // 4. Remove deselected children from KEPT container configs (renderer is data-driven, so it follows).
  applyRemovals(
    outProject,
    plan.containerChildEdits.map((e) => ({
      absPath: Path.resolve(opts.outDir, e.containerConfig),
      symbols: e.removeSymbols,
    })),
  )

  // 5. Deep collection prune: remove folder/file, remove from payload.config collections + import,
  //    remove from plugin/search string lists.
  if (plan.prunedCollections.length) {
    for (const c of plan.prunedCollections) {
      if (c.folderOrFile) fs.rmSync(Path.resolve(opts.outDir, c.folderOrFile), { recursive: true, force: true })
      for (const owned of c.ownedFiles) {
        fs.rmSync(Path.resolve(opts.outDir, owned), { recursive: true, force: true })
      }
    }
    applyRemovals(outProject, [
      {
        absPath: Path.resolve(opts.outDir, 'src/payload.config.ts'),
        symbols: plan.prunedCollections.map((c) => c.configImportRemoval),
      },
    ])
    const stringEdits = new Map<string, string[]>()
    for (const c of plan.prunedCollections) {
      for (const e of c.stringListEdits) {
        const key = e.file
        if (!stringEdits.has(key)) stringEdits.set(key, [])
        stringEdits.get(key)!.push(e.value)
      }
    }
    applyStringRemovals(
      outProject,
      [...stringEdits].map(([file, values]) => ({ absPath: Path.resolve(opts.outDir, file), values })),
    )
    // Drop now-unused collection symbol imports (e.g. `import { People }`) from the string-list files.
    const prunedSymbols = plan.prunedCollections.map((c) => c.symbol)
    applyRemovals(
      outProject,
      [...stringEdits.keys()].map((file) => ({ absPath: Path.resolve(opts.outDir, file), symbols: prunedSymbols })),
    )
  }

  // 5a2. Remove any relationship field pointing at a pruned collection from shared config files
  //      (e.g. Posts' `authors`→people / `categories`→categories). ts-morph keyed on relationTo, so
  //      it is whitespace-independent and never silently no-ops the way a text patch could.
  if (plan.prunedCollections.length) {
    const prunedSlugs = plan.prunedCollections.map((c) => c.slug)
    applyFieldRelationRemovals(outProject, [
      {
        absPath: Path.resolve(opts.outDir, 'src/cms/collections/Posts/index.ts'),
        slugs: prunedSlugs,
      },
    ])
  }

  // 5b. Apply per-collection shared-file patches (find/replace) for pruned collections.
  for (const c of plan.prunedCollections) {
    for (const patch of c.patches) {
      const abs = Path.resolve(opts.outDir, patch.file)
      if (!fs.existsSync(abs)) continue
      const text = fs.readFileSync(abs, 'utf8')
      if (text.includes(patch.find)) {
        fs.writeFileSync(abs, text.split(patch.find).join(patch.replace))
      }
    }
  }

  // 6. Trim pruned collections from kept blocks' config-driven relationTo lists (keeps them compiling).
  if (plan.relationTrimEdits.length) {
    applyValueRemovals(
      outProject,
      plan.relationTrimEdits.map((e) => ({
        absPath: Path.resolve(opts.outDir, e.blockConfig),
        values: e.removeCollectionSlugs,
      })),
    )
  }

  // 7. Prune deselected presentational heros: delete the folder, remove the `{ value }` option from
  //    the hero config select, and remove the slug→component entry (+ import) from RenderHero.
  if (plan.prunedHeros.length) {
    for (const h of plan.prunedHeros) {
      fs.rmSync(Path.resolve(opts.outDir, h.folder), { recursive: true, force: true })
    }
    applyValueRemovals(outProject, [
      {
        absPath: Path.resolve(opts.outDir, 'src/website/layout/heros/config.ts'),
        values: plan.prunedHeros.map((h) => h.slug),
      },
    ])
    applyObjectPropertyRemovals(outProject, [
      {
        absPath: Path.resolve(opts.outDir, 'src/website/layout/heros/RenderHero.tsx'),
        names: plan.prunedHeros.map((h) => h.slug),
      },
    ])
  }

  // 8. Prune deselected plugins: delete plugin-config owned files, remove the plugin call + its
  //    imports from plugins/index.ts, drop the package.json deps. Injected collections vanish with
  //    the plugin (they are not in payload.config), and related blocks were force-pruned in the plan.
  if (plan.prunedPlugins.length) {
    for (const p of plan.prunedPlugins) {
      for (const owned of p.ownedFiles) {
        fs.rmSync(Path.resolve(opts.outDir, owned), { recursive: true, force: true })
      }
    }
    const pluginsFile = Path.resolve(opts.outDir, 'src/cms/plugins/index.ts')
    const sf = outProject.addSourceFileAtPathIfExists(pluginsFile)
    if (sf) {
      for (const p of plan.prunedPlugins) {
        removeCallExpressionMember(sf, p.callee, p.helperImports)
      }
      sf.saveSync()
    }
    removePackageJsonDeps(
      Path.resolve(opts.outDir, 'package.json'),
      plan.prunedPlugins.map((p) => p.pkg),
    )
  }

  return plan
}

function removePackageJsonDeps(pkgPath: string, deps: string[]) {
  if (!fs.existsSync(pkgPath)) return
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  let changed = false
  for (const section of ['dependencies', 'devDependencies'] as const) {
    if (!pkg[section]) continue
    for (const dep of deps) {
      if (dep in pkg[section]) {
        delete pkg[section][dep]
        changed = true
      }
    }
  }
  if (changed) fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
}
