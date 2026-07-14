import Path from 'path'
import fs from 'fs'
import { Project, SyntaxKind, SourceFile } from 'ts-morph'

export interface BlockOverride {
  group?: string
  title?: string
  description?: string
  requiresCollections?: string[]
  requiresPlugins?: string[]
  onlyInside?: string
  inlineOnly?: boolean
}

export interface CollectionPatch {
  file: string
  find: string
  replace: string
}

export interface CollectionOverride {
  ownedFiles?: string[]
  patches?: CollectionPatch[]
}

export interface Overrides {
  blocks: Record<string, BlockOverride>
  collections: Record<string, CollectionOverride>
}

export interface ContainerChild {
  symbol: string // export const of the child, as referenced in the container's blocks:[]
  slug: string
}

export interface DiscoveredBlock {
  slug: string
  folder: string
  configPath: string
  exportConst: string
  interfaceName?: string
  showOnPage: boolean
  registeredIn: 'exports' | 'blocksFeature'
  /** Child blocks this block nests via a type:'blocks' field. Empty for non-containers. */
  children: ContainerChild[]
  override: BlockOverride
}

export interface DiscoveredCollection {
  slug: string
  symbol: string
  importPath: string
  core: boolean
  ownedFiles: string[]
  patches: CollectionPatch[]
}

// Core collections are never offered for pruning (auth, media library, privacy/analytics).
const CORE_COLLECTION_SYMBOLS = new Set([
  'Pages',
  'Media',
  'Users',
  'ConsentTokens',
  'AnalyticsAggregates',
])

export interface DiscoveredHero {
  slug: string // the `value` in the hero `type` select (e.g. 'highImpact')
  folder: string // dir under src/website/layout/heros (e.g. 'HighImpact')
  symbol: string // export/import name in RenderHero.tsx (e.g. 'HighImpactHero')
}

export interface DiscoveredPlugin {
  slug: string // short id used in --plugins / selection (e.g. 'search')
  callee: string // the plugin function name in the plugins array (e.g. 'searchPlugin')
  pkg: string // npm package to drop from package.json
  helperImports: string[] // symbols imported only to configure this plugin
  injectsCollections: string[] // collection slugs this plugin injects (vanish with it)
  ownedFiles: string[] // repo-relative files that exist solely to configure this plugin
  relatedBlocks: string[] // block slugs that become meaningless without this plugin
}

export interface Discovery {
  blocks: DiscoveredBlock[]
  collections: DiscoveredCollection[]
  heros: DiscoveredHero[]
  plugins: DiscoveredPlugin[]
  pluginCollections: string[]
  overrides: Overrides
}

// Plugins the scaffolder offers for pruning. seoPlugin + nestedDocsPlugin are intentionally NOT here
// (removing them breaks meta rendering / breadcrumb nav on kept pages). Each entry lists what becomes
// orphaned so the pruner can clean imports, package.json, injected collections, and related blocks.
const SELECTABLE_PLUGINS: DiscoveredPlugin[] = [
  {
    slug: 'redirects',
    callee: 'redirectsPlugin',
    pkg: '@payloadcms/plugin-redirects',
    helperImports: ['revalidateRedirects'],
    injectsCollections: ['redirects'],
    ownedFiles: ['src/cms/hooks/revalidateRedirects.ts'],
    relatedBlocks: [],
  },
  {
    slug: 'form-builder',
    callee: 'formBuilderPlugin',
    pkg: '@payloadcms/plugin-form-builder',
    helperImports: [
      'phoneField',
      'privacyPolicyField',
      'formActionOptions',
      'copyFormActionToSubmission',
      'runFormAction',
    ],
    injectsCollections: ['forms', 'form-submissions'],
    ownedFiles: [
      'src/cms/fields/formBuilder.ts',
      'src/cms/forms',
      'src/cms/components/FormPreview',
    ],
    relatedBlocks: ['formBlock'],
  },
  {
    slug: 'search',
    callee: 'searchPlugin',
    pkg: '@payloadcms/plugin-search',
    helperImports: ['searchFields', 'beforeSyncWithSearch'],
    injectsCollections: ['search'],
    ownedFiles: ['src/cms/search'],
    relatedBlocks: [],
  },
]

function discoverPlugins(root: string): DiscoveredPlugin[] {
  const pluginsFile = Path.resolve(root, 'src/cms/plugins/index.ts')
  if (!fs.existsSync(pluginsFile)) return []
  const src = fs.readFileSync(pluginsFile, 'utf8')
  return SELECTABLE_PLUGINS.filter((p) => src.includes(p.callee))
}

// Presentational heros the scaffolder offers for pruning. `none` is always kept; `search` follows the
// search plugin and `PostHero` is posts-owned, so neither is independently selectable here.
const SELECTABLE_HEROS: DiscoveredHero[] = [
  { slug: 'highImpact', folder: 'HighImpact', symbol: 'HighImpactHero' },
  { slug: 'mediumImpact', folder: 'MediumImpact', symbol: 'MediumImpactHero' },
  { slug: 'lowImpact', folder: 'LowImpact', symbol: 'LowImpactHero' },
]

function discoverHeros(root: string): DiscoveredHero[] {
  const dir = Path.resolve(root, 'src/website/layout/heros')
  return SELECTABLE_HEROS.filter((h) => fs.existsSync(Path.resolve(dir, h.folder)))
}

const PLUGIN_COLLECTIONS: Record<string, string[]> = {
  '@payloadcms/plugin-form-builder': ['forms', 'form-submissions'],
  '@payloadcms/plugin-redirects': ['redirects'],
  '@payloadcms/plugin-search': ['search'],
}

function discoverPluginCollections(root: string): string[] {
  const pluginsFile = Path.resolve(root, 'src/cms/plugins/index.ts')
  if (!fs.existsSync(pluginsFile)) return []
  const src = fs.readFileSync(pluginsFile, 'utf8')
  const found = new Set<string>()
  for (const [pkg, slugs] of Object.entries(PLUGIN_COLLECTIONS)) {
    if (src.includes(pkg)) slugs.forEach((s) => found.add(s))
  }
  return [...found]
}

export function loadOverrides(root: string): Overrides {
  const p = Path.resolve(root, 'features/overrides.json')
  if (!fs.existsSync(p)) return { blocks: {}, collections: {} }
  const raw = JSON.parse(fs.readFileSync(p, 'utf8'))
  return { blocks: raw.blocks ?? {}, collections: raw.collections ?? {} }
}

function newProject(root: string): Project {
  return new Project({
    tsConfigFilePath: Path.resolve(root, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  })
}

function resolveAlias(root: string, spec: string, fromFile: string): string | null {
  if (spec.startsWith('@site/')) return Path.resolve(root, 'src/website', spec.slice('@site/'.length))
  if (spec.startsWith('@/cms/')) return Path.resolve(root, 'src/cms', spec.slice('@/cms/'.length))
  if (spec.startsWith('@public/')) return Path.resolve(root, 'public', spec.slice('@public/'.length))
  if (spec === '@payload-config') return Path.resolve(root, 'src/payload.config.ts')
  if (spec === '@/payload-types') return Path.resolve(root, 'src/payload-types.ts')
  if (spec.startsWith('@/')) return Path.resolve(root, 'src', spec.slice('@/'.length))
  if (spec.startsWith('.')) return Path.resolve(Path.dirname(fromFile), spec)
  return null
}

function readSlugAndMeta(sf: SourceFile): {
  slug?: string
  interfaceName?: string
  showOnPage: boolean
  exportConst?: string
} {
  let slug: string | undefined
  let interfaceName: string | undefined
  let showOnPage = true
  let exportConst: string | undefined

  for (const decl of sf.getVariableDeclarations()) {
    if (!decl.isExported()) continue
    const init = decl.getInitializer()
    if (!init || init.getKind() !== SyntaxKind.ObjectLiteralExpression) continue
    const obj = init.asKind(SyntaxKind.ObjectLiteralExpression)!
    const getProp = (name: string) => obj.getProperty(name)?.asKind(SyntaxKind.PropertyAssignment)
    const slugProp = getProp('slug')
    if (!slugProp) continue
    exportConst = decl.getName()
    slug = slugProp.getInitializer()?.asKind(SyntaxKind.StringLiteral)?.getLiteralValue()
    interfaceName = getProp('interfaceName')?.getInitializer()?.asKind(SyntaxKind.StringLiteral)?.getLiteralValue()
    const sop = getProp('showOnPage')?.getInitializer()?.getText()
    if (sop === 'false') showOnPage = false
    break
  }
  return { slug, interfaceName, showOnPage, exportConst }
}

/** Extract child block symbols referenced in any `type: 'blocks'` field of a block config. */
function readChildSymbols(sf: SourceFile): string[] {
  const symbols = new Set<string>()
  for (const obj of sf.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)) {
    const typeProp = obj.getProperty('type')?.asKind(SyntaxKind.PropertyAssignment)
    const typeVal = typeProp?.getInitializer()?.asKind(SyntaxKind.StringLiteral)?.getLiteralValue()
    if (typeVal !== 'blocks') continue
    const blocksArr = obj
      .getProperty('blocks')
      ?.asKind(SyntaxKind.PropertyAssignment)
      ?.getInitializer()
      ?.asKind(SyntaxKind.ArrayLiteralExpression)
    for (const el of blocksArr?.getElements() ?? []) {
      if (el.getKind() === SyntaxKind.Identifier) symbols.add(el.getText())
    }
  }
  return [...symbols]
}

export function discover(root: string): Discovery {
  const overrides = loadOverrides(root)
  const project = newProject(root)

  const blocks: DiscoveredBlock[] = []
  const seenSlugs = new Set<string>()
  const childSymbolsBySlug = new Map<string, string[]>() // container slug -> child export-const symbols

  // 1. Page-builder blocks: named imports in exports.ts
  const exportsPath = Path.resolve(root, 'src/website/blocks/exports.ts')
  const exportsSf = project.addSourceFileAtPath(exportsPath)
  const configImports = new Map<string, string>() // exportConst -> resolved config path
  for (const imp of exportsSf.getImportDeclarations()) {
    const spec = imp.getModuleSpecifierValue()
    if (!spec.endsWith('/config')) continue
    const resolved = resolveAlias(root, spec, exportsPath)
    if (!resolved) continue
    const configPath = resolved.endsWith('.ts') ? resolved : `${resolved}.ts`
    for (const named of imp.getNamedImports()) configImports.set(named.getName(), configPath)
  }

  for (const [exportConst, configPath] of configImports) {
    if (!fs.existsSync(configPath)) continue
    const sf = project.addSourceFileAtPath(configPath)
    const meta = readSlugAndMeta(sf)
    if (!meta.slug) continue
    seenSlugs.add(meta.slug)
    childSymbolsBySlug.set(meta.slug, readChildSymbols(sf))
    blocks.push({
      slug: meta.slug,
      folder: Path.basename(Path.dirname(configPath)),
      configPath: Path.relative(root, configPath),
      exportConst,
      interfaceName: meta.interfaceName,
      showOnPage: meta.showOnPage,
      registeredIn: 'exports',
      children: [],
      override: overrides.blocks[meta.slug] ?? {},
    })
  }

  // 2. Inline-only blocks: BlocksFeature({ blocks: [...] }) inside collection configs
  const collGlob = Path.resolve(root, 'src/cms/collections')
  const collFiles = project.addSourceFilesAtPaths(`${collGlob}/**/*.ts`)
  for (const sf of collFiles) {
    for (const call of sf.getDescendantsOfKind(SyntaxKind.CallExpression)) {
      if (call.getExpression().getText() !== 'BlocksFeature') continue
      const arg = call.getArguments()[0]?.asKind(SyntaxKind.ObjectLiteralExpression)
      const blocksProp = arg?.getProperty('blocks')?.asKind(SyntaxKind.PropertyAssignment)
      const arr = blocksProp?.getInitializer()?.asKind(SyntaxKind.ArrayLiteralExpression)
      if (!arr) continue
      for (const el of arr.getElements()) {
        const symbolName = el.getText()
        const imp = sf.getImportDeclaration((d) =>
          d.getNamedImports().some((n) => n.getName() === symbolName),
        )
        const spec = imp?.getModuleSpecifierValue()
        if (!spec) continue
        const resolved = resolveAlias(root, spec, sf.getFilePath())
        if (!resolved) continue
        const configPath = resolved.endsWith('.ts') ? resolved : `${resolved}.ts`
        if (!fs.existsSync(configPath)) continue
        const bsf = project.addSourceFileAtPath(configPath)
        const meta = readSlugAndMeta(bsf)
        if (!meta.slug || seenSlugs.has(meta.slug)) continue
        seenSlugs.add(meta.slug)
        childSymbolsBySlug.set(meta.slug, readChildSymbols(bsf))
        blocks.push({
          slug: meta.slug,
          folder: Path.basename(Path.dirname(configPath)),
          configPath: Path.relative(root, configPath),
          exportConst: symbolName,
          interfaceName: meta.interfaceName,
          showOnPage: meta.showOnPage,
          registeredIn: 'blocksFeature',
          children: [],
          override: overrides.blocks[meta.slug] ?? {},
        })
      }
    }
  }

  // 3. Collections: the collections: [...] array in payload.config.ts
  const collections: DiscoveredCollection[] = []
  const configSf = project.addSourceFileAtPath(Path.resolve(root, 'src/payload.config.ts'))
  const buildConfigCall = configSf
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .find((c) => c.getExpression().getText() === 'buildConfig')
  const cfgObj = buildConfigCall?.getArguments()[0]?.asKind(SyntaxKind.ObjectLiteralExpression)
  const collArr = cfgObj
    ?.getProperty('collections')
    ?.asKind(SyntaxKind.PropertyAssignment)
    ?.getInitializer()
    ?.asKind(SyntaxKind.ArrayLiteralExpression)
  for (const el of collArr?.getElements() ?? []) {
    const symbol = el.getText()
    const imp = configSf.getImportDeclaration((d) =>
      d.getNamedImports().some((n) => n.getName() === symbol),
    )
    const slug = symbol.toLowerCase()
    collections.push({
      slug,
      symbol,
      importPath: imp?.getModuleSpecifierValue() ?? '',
      core: CORE_COLLECTION_SYMBOLS.has(symbol),
      ownedFiles: overrides.collections[slug]?.ownedFiles ?? [],
      patches: overrides.collections[slug]?.patches ?? [],
    })
  }

  // Resolve container children: map each container's child export-const symbols to block slugs.
  const slugByExportConst = new Map(blocks.map((b) => [b.exportConst, b.slug]))
  for (const b of blocks) {
    const symbols = childSymbolsBySlug.get(b.slug) ?? []
    b.children = symbols
      .map((symbol) => ({ symbol, slug: slugByExportConst.get(symbol) }))
      .filter((c): c is ContainerChild => !!c.slug)
  }

  return {
    blocks,
    collections,
    heros: discoverHeros(root),
    plugins: discoverPlugins(root),
    pluginCollections: discoverPluginCollections(root),
    overrides,
  }
}
